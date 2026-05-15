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
        payload: {
          attribute: input.attributeName,
          priorValue,
          newValue,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const attr = state.attributes.find(
        (a) => a.name === entry.payload.attribute
      );
      attr.points = entry.payload.priorValue;
      state.spent_xp = entry.payload.priorSpentXp;
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
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      state.skills[entry.payload.skill] = entry.payload.priorValue;
      state.spent_xp = entry.payload.priorSpentXp;
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
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.specialtiesFromXp.findIndex(
        (s) => s.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.specialtiesFromXp.splice(idx, 1);
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

  native_gift: {
    label: (e) => `Purchased Native Gift: ${e.payload.giftName}`,
    record: (state, input) => {
      const priorGiftTotal = state.gift_total;
      const cost = (priorGiftTotal + 1) * 2;
      return {
        type: "native_gift",
        cost,
        payload: {
          entryId: newId(),
          giftName: input.giftSelection.gift_name,
          priorGiftTotal,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.purchased_gifts.native.findIndex(
        (g) => g.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.purchased_gifts.native.splice(idx, 1);
      state.gift_total = entry.payload.priorGiftTotal;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

  tribe_gift: {
    label: (e) => `Purchased Tribe Gift: ${e.payload.giftName}`,
    record: (state, input) => {
      const priorGiftTotal = state.gift_total;
      const cost = (priorGiftTotal + 1) * 2;
      return {
        type: "tribe_gift",
        cost,
        payload: {
          entryId: newId(),
          giftName: input.giftSelection.gift_name,
          priorGiftTotal,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.purchased_gifts.tribe.findIndex(
        (g) => g.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.purchased_gifts.tribe.splice(idx, 1);
      state.gift_total = entry.payload.priorGiftTotal;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

  auspice_gift: {
    label: (e) => `Purchased Auspice Gift: ${e.payload.giftName}`,
    record: (state, input) => {
      const priorGiftTotal = state.gift_total;
      const cost = (priorGiftTotal + 1) * 2;
      return {
        type: "auspice_gift",
        cost,
        payload: {
          entryId: newId(),
          giftName: input.giftSelection.gift_name,
          priorGiftTotal,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.purchased_gifts.auspice.findIndex(
        (g) => g.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.purchased_gifts.auspice.splice(idx, 1);
      state.gift_total = entry.payload.priorGiftTotal;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

  rite: {
    label: (e) => `Purchased Rite: ${e.payload.riteName}`,
    record: (state, input) => {
      return {
        type: "rite",
        cost: 5,
        payload: {
          entryId: newId(),
          riteName: input.riteSelection.rite_name,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      const idx = state.purchased_gifts.rite.findIndex(
        (r) => r.entryId === entry.payload.entryId
      );
      if (idx !== -1) state.purchased_gifts.rite.splice(idx, 1);
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

  renown: {
    label: (e) =>
      `Raised ${e.payload.counter} renown to ${e.payload.newValue}`,
    record: (state, input) => {
      const counter = input.renownName.toLowerCase();
      const priorValue = state.purchased_renown[counter];
      const newValue = priorValue + 1;
      // cost is based on renownTotal (tribe + purchased); caller passes renownTotal
      const cost = (input.renownTotal + 1) * 5;
      return {
        type: "renown",
        cost,
        payload: {
          counter,
          priorValue,
          newValue,
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      state.purchased_renown[entry.payload.counter] = entry.payload.priorValue;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

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
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },

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
          priorSpentXp: state.spent_xp,
        },
      };
    },
    undo: (state, entry) => {
      state[entry.payload.counter] = entry.payload.priorValue;
      state.spent_xp = entry.payload.priorSpentXp;
    },
  },
};

export default handlers;
