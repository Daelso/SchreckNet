const express = require("express");
let router = express.Router();
const CharFolders = require("../models/char_folder/CharFolders");
const CharsInFolders = require("../models/char_folder/CharsInFolders");

//Route is base/char_folders/
router.route("/add").post(async (req, res) => {
  const owner = req.currentUser.id;
  const { game_line, name } = req.body;
  if (!owner) {
    return res.sendStatus(403);
  }

  if (!game_line) {
    return res.status(400).json({
      error: "Missing required query parameter: game_line",
    });
  }
  try {
    const check = await CharFolders.findAll({
      where: {
        owner,
        game_line,
        folder_name: name.trim(),
      },
    });
    if (check.length > 0) {
      return res.status(409).send("Folder with that name already exists");
    }

    const trimmed = name.trim();

    if (trimmed.length > 75) {
      return res.status(400).json({
        error: "Folder name must be 75 characters or fewer",
      });
    }

    const new_folder = await CharFolders.create({
      folder_name: trimmed,
      owner,
      game_line,
    });

    return res.status(200).json(new_folder);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error creating a new folder");
  }
});

router.route("/add_character").post(async (req, res) => {
  const owner = req.currentUser.id;
  const { folder_id, character_id } = req.body;
  if (!owner) {
    return res.sendStatus(403);
  }

  if (!folder_id) {
    return res.status(400).json({
      error: "Missing required query parameter: folder_id",
    });
  }

  if (!character_id) {
    return res.status(400).json({
      error: "Missing required query parameter: character_id",
    });
  }
  try {
    const check = await CharFolders.findByPk(folder_id);

    if (!check) {
      return res.status(404).send("No folder has been found");
    }

    if (check.owner !== owner) {
      return res.sendStatus(403);
    }

    await CharsInFolders.create({
      char_id: character_id,
      parent_folder: check.folder_id,
    });

    return res.status(200).send("Character added to folder!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error adding character to folder");
  }
});
router.route("/remove_character").post(async (req, res) => {
  const owner = req.currentUser.id;
  const { entry_id, folder_id } = req.body;
  if (!owner) {
    return res.sendStatus(403);
  }

  if (!entry_id) {
    return res.status(400).json({
      error: "Missing required query parameter: entry_id",
    });
  }

  try {
    const check = await CharFolders.findByPk(folder_id);
    if (!check) {
      return res.status(404).send("No folder has been found");
    }

    if (check.owner !== owner) {
      return res.sendStatus(403);
    }

    const folder_entry = await CharsInFolders.findByPk(entry_id);

    if (!folder_entry) {
      return res.sendStatus(404);
    }

    await folder_entry.destroy();

    return res.status(200).send("Character added to folder!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error adding character to folder");
  }
});

router.route("/my_folders").get(async (req, res) => {
  try {
    const owner = req.currentUser.id;
    const { game_line } = req.query;
    if (!owner) {
      return res.sendStatus(403);
    }

    if (!game_line) {
      return res.status(400).json({
        error: "Missing required query parameter: game_line",
      });
    }

    const folders = await CharFolders.findAll({
      where: {
        game_line,
        owner,
      },
    });

    return res.status(200).json(folders);
  } catch (err) {
    console.error(err);
    return res.status(403).send("Forbidden");
  }
});

router.route("/this_char").get(async (req, res) => {
  try {
    const owner = req.currentUser?.id;
    const { game_line, char_id } = req.query;

    if (!owner) return res.sendStatus(403);

    if (!char_id || !game_line) {
      return res.status(400).json({
        error: "char_id and game_line are required",
      });
    }

    const folders = await CharsInFolders.findAll({
      where: {
        char_id,
      },
      include: [
        {
          model: CharFolders,
          required: true,
          where: {
            owner,
            game_line,
          },
          attributes: ["folder_id", "folder_name"],
        },
      ],
    });

    // flatten response for frontend
    const result = folders.map((row) => ({
      folder_id: row.char_folder.folder_id,
      folder_name: row.char_folder.folder_name,
      entry_id: row.entry_id,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch character folders",
    });
  }
});

module.exports = router; //Exports our routes
