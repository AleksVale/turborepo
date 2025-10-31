const base = require('../../packages/eslint-config/base.js');
module.exports = {
	...base,
	extends: [
		...(base.extends || []),
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	plugins: [
		...(base.plugins || []),
		'react',
		'react-hooks',
	],
	settings: {
		...(base.settings || {}),
		react: {
			version: 'detect',
		},
	},
};
