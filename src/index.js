const btoa = require('btoa');
const request = require('./util/request');


class Oauth {
    constructor(option={
        version: undefined,
        client_secret: undefined,
        client_id: undefined,
        redirect_uri: undefined,
    }) {
        this.version = option.version || 'v8';
        this.client_id = option.client_id.toString();
        this.client_secret = option.client_secret;
        this.redirect_uri = option.redirect_uri;
    }

    /**
     * get Access token
     * @example let token = await Oauth.getToken({
     *   grant_type: 'authorization_code'
     *   code: 'ndvklet5qfgalw3rfafjaaae2';
     *   scope: ['identify'];
     * })
     * @param {Object} option 
     */
    async getToken(option) {
        option.redirect_uri = this.redirect_uri;
        let body = this._urlEncode(option);

        let res = await request('POST', `/${this.version}/oauth2/token`, {
            type: 'Basic',
            creds: btoa(`${this.client_id}:${this.client_secret}`),
        }, {
            content_type: 'application/x-www-form-urlencoded',
        }, body);

        res.scope = res.scope.split(' ')
        return res;
    }

    /**
     * revoke the token
     * @param {string} token 
     * @returns {Promise<object>}
     */
    async revokeToken(token) {
        let res = await request('POST', `/${this.version}/oauth2/token/revoke`, {
            type: 'Basic',
            creds: btoa(`${this.client_id}:${this.client_secret}`),
        }, {
            content_type: 'application/x-www-form-urlencoded',
        }, `token=${token}`);
        return res;
    }

    /**
     * get user info
     * @param {string} access_token 
     * @returns {Promise<object>}
     */
    async user(access_token) {
        let res = await request('GET', `/${this.version}/users/@me`, {
            type: 'Bearer',
            creds: access_token,
        }, {
            content_type: 'application/json',
        });
        return res;
    }

    /**
     * get user's guilds
     * @param {string} access_token 
     * @returns {Promise<array>}
     */
    async userGuilds(access_token) {
        let res = await request('GET', `/${this.version}/users/@me/guilds`, {
            type: 'Bearer',
            creds: access_token,
        }, {
            content_type: 'application/json',
        });
        return res;
    }

    /**
     * get user guild by guild id
     * @param {string} access_token 
     * @param {string} guild_id 
     * @returns {Promise<object>}
     */
    async userGuild(access_token, guild_id) {
        let res = await request('GET', `/${this.version}/users/@me/guilds/${guild_id}`, {
            type: 'Bearer',
            creds: access_token,
        }, {
            content_type: 'application/json',
        });
        return res;
    }

    /**
     * get guild channels
     * @param {String} access_token 
     * @param {String} guild_id 
     * @returns {Promise<object[]>}
     */
    async userGuildChannels(access_token, guild_id) {
        let res = await request('GET', `/${this.version}/users/@me/guilds/${guild_id}/channels`, {
            type: 'Bearer',
            creds: access_token,
        }, {
            content_type: 'application/json',
        });
        return res;
    }

    /**
     * search guild member
     * @param {string} access_token 
     * @param {string} guild_id 
     * @param {string} query 
     * @param {number} limit 
     * @returns {Promise<object[]>}
     */
    async searchGuildMember(access_token, guild_id, query, limit=1) {
        let res = await request('GET',
        `/${this.version}/users/@me/guilds/${guild_id}/members/search?query=${query}&limit=${limit}`,
        {
            type: 'Bearer',
            creds: access_token,
        }, {
            content_type: 'application/json',
        });
        return res;
    }


    _urlEncode(e){let n="";for(let[o,t]of Object.entries(e))t&&(n+=`&${encodeURIComponent(o)}=${encodeURIComponent(t)}`);return n.substr(1)}
}

module.exports = Oauth;