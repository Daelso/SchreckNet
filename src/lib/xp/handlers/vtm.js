import { newId } from "../xpLog.js";

const handlers = {
  attribute_raise: {
    label: (e) => `Raised ${e.payload.attribute} to ${e.payload.newValue}`,
    record: (state, input) => {
      const attr = state.attributes.find((a) => a.name === input.attributeName);
      const priorValue = attr.points;
      const newValue = priorValue + 1;
      return {
        type: "attribute_raise",
        cost: newValue * 5,
        payload: { attribute: input.attributeName, priorValue, newValue },
      };
    },
    undo: (state, entry) => {
      const attr = state.attributes.find(
        (a) => a.name === entry.payload.attribute
      );
      attr.points = entry.payload.priorValue;
    },
  },

  skill_raise: {
    label: (e) => `Raised ${e.payload.skill} to ${e.payload.newValue}`,
    record: (state, input) => {
      const key = input.skillName.toLowerCase();
      const priorValue = state.skills[key];
      const newValue = priorValue + 1;
      // first dot (0 → 1) costs 3; subsequent dots cost (prior+1)*3
      const cost = priorValue === 0 ? 3 : newValue * 3;
      return {
        type: "skill_raise",
        cost,
        payload: { skill: key, priorValue, newValue },
      };
    },
    undo: (state, entry) => {
      state.skills[entry.payload.skill] = entry.payload.priorValue;
    },
  },

  specialty: {
    label: (e) => `Added specialty ${e.payload.specialty} (${e.payload.skill})`,
    record: (_state, input) => {
      return {
        type: "specialty",
        cost: 3,
        payload: {
          entryId: newId(),
          skill: input.skill,
          specialty: input.specialty,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.specialtiesFromXp.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.specialtiesFromXp.splice(idx, 1);
    },
  },

  clan_discipline: {
    label: (e) =>
      `Raised ${e.payload.discipline} to ${e.payload.newValue} (${e.payload.power})`,
    record: (state, input) => {
      const priorValue = state.disciplines[input.discipline];
      const newValue = priorValue + 1;
      return {
        type: "clan_discipline",
        cost: newValue * 5,
        payload: {
          entryId: newId(),
          discipline: input.discipline,
          priorValue,
          newValue,
          power: input.power,
        },
      };
    },
    undo: (state, entry) => {
      state.disciplines[entry.payload.discipline] = entry.payload.priorValue;
      const idx = state.disciplineSkillsObj.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.disciplineSkillsObj.splice(idx, 1);
    },
  },

  caitiff_discipline: {
    label: (e) =>
      `Raised Caitiff ${e.payload.discipline} to ${e.payload.newValue} (${e.payload.power})`,
    record: (state, input) => {
      const existing = state.disciplines[input.discipline];
      const priorValue =
        existing === undefined || existing === null ? 0 : existing;
      const newValue = priorValue + 1;
      // first dot costs 6; subsequent dots cost (prior+1)*6
      const cost = priorValue === 0 ? 6 : newValue * 6;
      return {
        type: "caitiff_discipline",
        cost,
        payload: {
          entryId: newId(),
          discipline: input.discipline,
          priorValue,
          newValue,
          power: input.power,
        },
      };
    },
    undo: (state, entry) => {
      state.disciplines[entry.payload.discipline] = entry.payload.priorValue;
      const idx = state.disciplineSkillsObj.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.disciplineSkillsObj.splice(idx, 1);
    },
  },

  out_of_clan_discipline: {
    label: (e) =>
      `Raised out-of-clan ${e.payload.discipline} to ${e.payload.newValue} (${e.payload.power})`,
    record: (state, input) => {
      const existing = state.disciplines[input.discipline];
      const priorValue =
        existing === undefined || existing === null ? 0 : existing;
      const newValue = priorValue + 1;
      return {
        type: "out_of_clan_discipline",
        cost: newValue * 7,
        payload: {
          entryId: newId(),
          discipline: input.discipline,
          priorValue,
          newValue,
          power: input.power,
        },
      };
    },
    undo: (state, entry) => {
      state.disciplines[entry.payload.discipline] = entry.payload.priorValue;
      const idx = state.disciplineSkillsObj.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.disciplineSkillsObj.splice(idx, 1);
    },
  },

  blood_potency: {
    label: (e) => `Raised Blood Potency to ${e.payload.newValue}`,
    record: (state, _input) => {
      const priorValue = state.potency;
      const newValue = priorValue + 1;
      return {
        type: "blood_potency",
        cost: newValue * 10,
        payload: { priorValue, newValue },
      };
    },
    undo: (state, entry) => {
      state.potency = entry.payload.priorValue;
    },
  },

  blood_ritual: {
    label: (e) => `Learned ritual: ${e.payload.ritualName}`,
    record: (_state, input) => {
      return {
        type: "blood_ritual",
        cost: input.ritualLevel * 3,
        payload: {
          entryId: newId(),
          ritualName: input.ritualName,
          ritualLevel: input.ritualLevel,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.disciplineSkillsObj.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.disciplineSkillsObj.splice(idx, 1);
    },
  },

  oblivion_ceremony: {
    label: (e) => `Learned ceremony: ${e.payload.ceremonyName}`,
    record: (_state, input) => {
      return {
        type: "oblivion_ceremony",
        cost: input.ceremonyLevel * 3,
        payload: {
          entryId: newId(),
          ceremonyName: input.ceremonyName,
          ceremonyLevel: input.ceremonyLevel,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.disciplineSkillsObj.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.disciplineSkillsObj.splice(idx, 1);
    },
  },

  advantage_point: {
    label: (e) =>
      e.payload.delta > 0
        ? `Added ${e.payload.delta} advantage point(s)`
        : `Removed ${Math.abs(e.payload.delta)} advantage point(s)`,
    record: (state, input) => {
      const counter = "advantages_remaining";
      const priorValue = state[counter];
      return {
        type: "advantage_point",
        cost: input.delta * 3,
        payload: { counter, priorValue, delta: input.delta },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
    },
  },

  flaw_point: {
    label: (e) =>
      e.payload.delta > 0
        ? `Added ${e.payload.delta} flaw point(s)`
        : `Removed ${Math.abs(e.payload.delta)} flaw point(s)`,
    record: (state, input) => {
      const counter = "flaws_remaining";
      const priorValue = state[counter];
      return {
        type: "flaw_point",
        cost: input.delta * 3,
        payload: { counter, priorValue, delta: input.delta },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
    },
  },
};

export default handlers;
