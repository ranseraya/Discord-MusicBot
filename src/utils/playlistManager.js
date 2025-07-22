const fs = require('node:fs');
const path = require('node:path');

const playlistsFilePath = path.join(__dirname, '..', '..', 'playlists.json');

function readPlaylists() {
    try {
        if (!fs.existsSync(playlistsFilePath)) {
            fs.writeFileSync(playlistsFilePath, '{}');
            return {};
        }
        const data = fs.readFileSync(playlistsFilePath, 'utf8');
        if (data.trim() === '') {
            return {};
        }
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read playlists.json, creating new file:", error);
        fs.writeFileSync(playlistsFilePath, '{}');
        return {};
    }
}

function savePlaylists(data) {
    const tempFilePath = playlistsFilePath + '.tmp';
    try {
        fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));
        fs.renameSync(tempFilePath, playlistsFilePath);
    } catch (error) {
        console.error("Failed to save playlists.json:", error);
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}

module.exports = { readPlaylists, savePlaylists };