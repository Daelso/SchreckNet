import { newId } from "../xpLog.js";

// Hunter tracks spentXp (camelCase) — see spendXp.vue's localSpentXp / spentXp prop.

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
        payload: {
          attribute: input.attributeName,
          priorValue,
          newValue,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      const attr = state.attributes.find(
        (a) => a.name === entry.payload.attribute
      );
      attr.points = entry.payload.priorValue;
      state.spentXp = entry.payload.priorSpentXp;
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
        payload: {
          skill: key,
          priorValue,
          newValue,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      state.skills[entry.payload.skill] = entry.payload.priorValue;
      state.spentXp = entry.payload.priorSpentXp;
    },
  },

  specialty: {
    label: (e) => `Added specialty ${e.payload.specialty} (${e.payload.skill})`,
    record: (state, input) => {
      return {
        type: "specialty",
        cost: 3,
        payload: {
          entryId: newId(),
          skill: input.skill,
          specialty: input.specialty,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.specialtiesFromXp.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.specialtiesFromXp.splice(idx, 1);
      state.spentXp = entry.payload.priorSpentXp;
    },
  },

  // Edge — flat cost 7; pushed to edgeArr.edges as { category, edge }
  edge: {
    label: (e) => `Purchased Edge: ${e.payload.edge} (${e.payload.category})`,
    record: (state, input) => {
      return {
        type: "edge",
        cost: 7,
        payload: {
          entryId: newId(),
          category: input.category,
          edge: input.edge,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.edgeArr.edges.findIndex(
        (e) => e.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.edgeArr.edges.splice(idx, 1);
      state.spentXp = entry.payload.priorSpentXp;
    },
  },

  // Perk — flat cost 3; pushed to edgeArr.perks as { category, perk }
  perk: {
    label: (e) => `Purchased Perk: ${e.payload.perk} (${e.payload.category})`,
    record: (state, input) => {
      return {
        type: "perk",
        cost: 3,
        payload: {
          entryId: newId(),
          category: input.category,
          perk: input.perk,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.edgeArr.perks.findIndex(
        (p) => p.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.edgeArr.perks.splice(idx, 1);
      state.spentXp = entry.payload.priorSpentXp;
    },
  },

  // Advantage — counter delta, cost delta*3
  advantage: {
    label: (e) =>
      e.payload.delta > 0
        ? `Added ${e.payload.delta} advantage point(s)`
        : `Removed ${Math.abs(e.payload.delta)} advantage point(s)`,
    record: (state, input) => {
      const counter = "advantagePoints";
      const priorValue = state[counter];
      return {
        type: "advantage",
        cost: input.delta * 3,
        payload: {
          counter,
          priorValue,
          delta: input.delta,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
      state.spentXp = entry.payload.priorSpentXp;
    },
  },

  // Flaw — counter delta, cost delta*3
  flaw: {
    label: (e) =>
      e.payload.delta > 0
        ? `Added ${e.payload.delta} flaw point(s)`
        : `Removed ${Math.abs(e.payload.delta)} flaw point(s)`,
    record: (state, input) => {
      const counter = "flaws_remaining";
      const priorValue = state[counter];
      return {
        type: "flaw",
        cost: input.delta * 3,
        payload: {
          counter,
          priorValue,
          delta: input.delta,
          priorSpentXp: state.spentXp,
        },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
      state.spentXp = entry.payload.priorSpentXp;
    },
  },
};

export default handlers;
