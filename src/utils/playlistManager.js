const fs = require('node:fs');
const path = require('node:path');

const playlistsFilePath = path.join(__dirname, '..', '..', 'playlists.json');

function readPlaylists() {
    try {
        if (!fs.existsSync(playlistsFilePath)) {
            return {};
        }
        const data = fs.readFileSync(playlistsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read playlists.json file:", error);
        return {};
    }
}

function savePlaylists(data) {
    try {
        fs.writeFileSync(playlistsFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to save playlists.json file:", error);
    }
}

module.exports = { readPlaylists, savePlaylists };