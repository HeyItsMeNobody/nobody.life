var passport = require('passport');
var DiscordStrategy = require('passport-discord');
var config = require('./config.json');
var getConnection = require('./mysqlPool.js');

passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    getConnection(function(err, conn) {
        var sqlselect = `SELECT * FROM auth WHERE id = ${user.id};`
        conn.query(sqlselect, function (err, result) {
            if(err) console.log(err);
            if (result.length > 0) {
                done(null, result[0])
            }
        });
        conn.release();
    });
});

passport.use(new DiscordStrategy({
    clientID: config.discord.clientID,
    clientSecret: config.discord.clientSecret,
    callbackURL: config.discord.callbackURL
}, (accessToken, refreshToken, profile, done) => {
    getConnection(function(err, conn) {
        var sqlselect = `SELECT 1 FROM auth WHERE id = ${profile.id};`
        conn.query(sqlselect, function (err, result) {
            if (err) console.log(err);
            console.log(`Selecting id ${profile.id} from user database..`)
            if (result.length > 0) {
                var sqldelete = `DELETE FROM auth WHERE id = ${profile.id};`
                conn.query(sqldelete, function (err, result) {
                    if (err) console.log(err);
                    var sqlinsert2 = `INSERT INTO auth VALUES (${profile.id}, "${profile.username}", "${profile.discriminator}", "https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg?size=1024")`
                    conn.query(sqlinsert2, function (err, result) {
                        if (err) console.log(err);
                        console.log(`There already was a user with ${profile.id} so deleted and added again.`)
                    });
                });
            }
            else {
                var sqlinsert = `INSERT INTO auth VALUES (${profile.id}, "${profile.username}", "${profile.discriminator}", "https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.jpg?size=1024")`
                conn.query(sqlinsert, function (err, result) {
                    if (err) console.log(err);
                    console.log(`No user found with ${profile.id} so added it.`)
                });
            }
        });
        console.log(profile);
        conn.release();
    });
    done(null, profile)
}));