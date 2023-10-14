import mysql from 'mysql2'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const urlPrefix = 'http://localhost:5000/';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dalildalil33',
  database: 'vidl'
}).promise()

export async function logIn(log) {
    console.log(log)
    try {
        const [result] = await pool.query(`SELECT * FROM user WHERE username = ?`, [log.username])
        if (result.length >= 1) {
            const pwd_match = await bcrypt.compare(log.password, result[0].password_hash);
            if (pwd_match) {
                const token = jwt.sign({ userId: result[0].id }, 'bV7Bn^TmEgZ!xQ2c@L#J9W4mKpA&d3G8', { expiresIn: '24h' });
                return { success: true, token };
            }
        }
        return { success: false };
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}

export async function register(reg) {
    try {
        const [result] = await pool.query(`SELECT * FROM user WHERE username = ?`,[reg.username])
        if (result.length < 1) {
            const password = await bcrypt.hash(reg.password, await bcrypt.genSalt(10))
            const [newResult] = await pool.query(`INSERT INTO user (full_name, username, email_address, password_hash) VALUES( ?, ?, ?, ? ) `,[ reg.name, reg.username, reg.email, password ])
            const [result] = await pool.query(`SELECT * FROM user WHERE username = ?`, [reg.username])
            const token = jwt.sign({ userId: result[0].id }, 'bV7Bn^TmEgZ!xQ2c@L#J9W4mKpA&d3G8', { expiresIn: '24h' });
            return { success: true, token };
        }
        return { success : false }
    } catch(error) {
        console.log(error);
        return { success: false }
    }
}

export async function follow( follower, following ) {
    try {
        const [result] = await pool.query(`SELECT * FROM user WHERE username = ?`, [following])
        const [check] = await pool.query(`SELECT * FROM UserRelationship WHERE follower_id = ? AND following_id = ? `, [follower, result[0].id])
        if ( ( result.length >= 1 ) && ( check.length == 0 ) ) {
            pool.query(`INSERT INTO UserRelationship (follower_id, following_id) VALUES( ?, ? )`,[ follower, result[0].id ])
            return { success: true }
        } else {
            return { success: false }
        }
    } catch ( error ) {
        console.log(error);
        return { success: false }
    }
}

export async function unfollow( follower, following ) {
    try {
        const [result] = await pool.query(`SELECT * FROM user WHERE username = ?`, [following])
        const [check] = await pool.query(`SELECT * FROM UserRelationship WHERE follower_id = ? AND following_id = ? `, [follower, result[0].id])
        if ( ( result.length >= 1 ) && ( check.length != 0 ) ) {
            pool.query(`DELETE FROM UserRelationship WHERE follower_id = ? AND following_id = ? `,[ follower, result[0].id ])
            return { success: true }
        } else {
            return { success: false }
        }
    } catch ( error ) {
        console.log(error);
        return { success: false }
    }
}

export async function followers( username ) {
    try {
        const [result] = await pool.query(`SELECT Follower.username AS username
        FROM UserRelationship
        JOIN User AS Following ON UserRelationship.following_id = Following.id
        JOIN User AS Follower ON UserRelationship.follower_id = Follower.id
        WHERE Following.username = ?`, [username])
        if ( ( result.length >= 1 ) ) {
            const followers = result.map( ( follower ) => { return ( follower.username ) } )
            return { 
                success: true,
                followers: followers
             }
        } else {
            return { success: false }
        }
    } catch ( error ) {
        console.log(error);
        return { success: false }
    }
}

export async function following( username ) {
    try {
        const [result] = await pool.query(`SELECT Following.username AS username
        FROM UserRelationship
        JOIN User AS Follower ON UserRelationship.follower_id = Follower.id
        JOIN User AS Following ON UserRelationship.following_id = Following.id
        WHERE Follower.username = ?`, [username])
        const following = result.map( ( following ) => { return ( following.username ) } )
        return { 
            success: true,
            following: following 
        }
    } catch ( error ) {
        console.log(error);
        return { success: false }
    }
}

export async function posts( username ) {
    try {
        const [result] = await pool.query(`SELECT Post.*
        FROM Post
        INNER JOIN User ON Post.poster_id = User.id
        WHERE User.username = ?`, [username])
        const posts = result.map( ( post ) => { return ( post.url ) } )
        return { 
            success: true,
            posts: posts 
        }
    } catch ( error ) {
        console.log(error);
        return { success: false }
    }
}

export async function post( userId, profilePictureUrl, caption ) {
    try {
        const [result] = await pool.query(`INSERT INTO post (caption,poster_id,url) VALUES( ?, ?, ? ) `,[ caption, userId, profilePictureUrl ])
        return { success: true };
    } catch(error) {
        console.log(error);
        return { success: false }
    }
}

export async function info(username, userId) {
    try {
        const [userRows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);
        const [followerCountRows] = await pool.query('SELECT COUNT(*) AS followerCount FROM UserRelationship WHERE following_id = (SELECT id FROM User WHERE username = ?)', [username]);
        const [followingCountRows] = await pool.query('SELECT COUNT(*) AS followingCount FROM UserRelationship WHERE follower_id = (SELECT id FROM User WHERE username = ?)', [username]);
        const [postRows] = await pool.query('SELECT url FROM Post WHERE poster_id = (SELECT id FROM User WHERE username = ?)', [username]);
        const [userFollows] = await pool.query('SELECT * FROM UserRelationship WHERE following_id = (SELECT id FROM User WHERE username = ?) AND follower_id = ?', [username, userId])

        const userInfo = userRows[0];
        userInfo.followers = followerCountRows[0].followerCount;
        userInfo.followings = followingCountRows[0].followingCount;
        userInfo.postUrls = postRows.map((post) => { 
            const updatedPath = post.url.replace(/\\/g, '/');
            const parts = updatedPath.split('/');
            const filename = parts[parts.length - 1];
            return (urlPrefix + filename);
        });

        return {
            success: true,
            info: {
                username: userInfo.username,
                full_name: userInfo.full_name,
                profile_picture_url: userInfo.full_name,
                bio: userInfo.bio,
                followers: userInfo.followers,
                following: userInfo.followings,
                postUrls: userInfo.postUrls,
                is_followed: ( userFollows.length >= 1 ),
                is_user: ( userInfo.id == userId )
            }
        }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function infoId(id) {
    try {
        const [userRows] = await pool.query('SELECT * FROM User WHERE id = ?', [id]);
        const [followerCountRows] = await pool.query('SELECT COUNT(*) AS followerCount FROM UserRelationship WHERE following_id = ?', [id]);
        const [followingCountRows] = await pool.query('SELECT COUNT(*) AS followingCount FROM UserRelationship WHERE follower_id = ?', [id]);
        const [postRows] = await pool.query('SELECT url FROM Post WHERE poster_id = ?', [id]);

        const userInfo = userRows[0];
        userInfo.followers = followerCountRows[0].followerCount;
        userInfo.followings = followingCountRows[0].followingCount;
        userInfo.postUrls = postRows.map((post) => { 
            const updatedPath = post.url.replace(/\\/g, '/')
            const parts = updatedPath.split('/');
            const filename = parts[parts.length - 1]
            return ( urlPrefix + filename ) 
        });

        return {
            success : true,
            info : {
                username : userInfo.username,
                full_name : userInfo.full_name,
                profile_picture_url : userInfo.profile_picture_url,
                bio : userInfo.bio,
                followers : userInfo.followers,
                following : userInfo.followings,
                postUrls : userInfo.postUrls
            }
        }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function feed ( num ) {
    try{
        const [result] = await pool.query('SELECT Post.*, User.username, User.profile_picture_url FROM Post JOIN User ON Post.poster_id = User.id ORDER BY RAND() LIMIT ?;',[num])
        const posts = result.map( row => {
            const updatedPath = row.url.replace(/\\/g, '/')
            const parts = updatedPath.split('/');
            const filename = parts[parts.length - 1]
            return ({
                username : row.username,
                profile_picture_url : row.profile_picture_url,
                url : urlPrefix + filename,
                caption : row.caption
            })})
        return {
            success : true,
            posts : posts
        }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function search ( username ) {
    try {
        const [result] = await pool.query("SELECT username, profile_picture_url from user WHERE username LIKE ? LIMIT 10;",[username + '%'])
        return ({
            success : true,
            users : result
        })
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}