module.exports.findCompatible = function (users) {
    // this is just place holder for now
    // for more complicated games, you could imagine logic that determines
    // whether or not two users can play together based on the game constraints
    // they asked for
    if (users.length >= 2) {
	return users.slice(0, 2);
    } else {
	return undefined;
    }
};
