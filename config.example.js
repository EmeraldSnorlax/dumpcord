/* 
   Fill in your info.
   When done, rename this file to config.js
*/

const token = 'bot token from https://discord.com/developers';
const channel = 'right click the channel you want to upload to --> copy id';
const pathToDump = './files/'; // Include trailing slash!
const maxBundleSize = 8 * 1000000; // 8MB upload limit per message, DO NOT CHANGE UNLESS YOU KNOW WHAT YOU ARE DOING!

module.exports = {
	token,
	channel,
	pathToDump,
	maxBundleSize
};