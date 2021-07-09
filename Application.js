const Methods = require("./methods/Methods.js");

class Application {

    /**
     * Main class constructor
     * @param host Where your panel is hosted (EG: http(s)://panel.host.net/)
     * @param key
     */
    constructor(host, key) {
        this.hostUrl = host;
        this.apiKey = key;
    }

    processError(err) {
        if (err.status !== undefined) return err.status;
        if (err.statusCode !== undefined) return err.statusCode;
        if (this.getErrorCode(err) !== undefined) return this.getErrorCode(err);
        return err;
    }

    /**
     * When errors get thrown from pterodactyl, sometimes they have the error code at the very end of the error message. This method basically tries to retrive thos
     * @param err
     * @returns {number}
     */
    getErrorCode(err) {
        err = err.message;
        let str1 = err.charAt(err.length - 1);
        let str2 = err.charAt(err.length - 2);
        let str3 = err.charAt(err.length - 3);

        let num = str1 + str2 + str3;
        try {
            return parseInt(num);
        } catch {
            return undefined;
        }
    }

    /**
     * Gets a list of users from your panel
     *
     * @returns {Promise<unknown>}
     * @param {Integer} Page number
     */
    getAllUsers() {
        return new Promise((res, rej) => {
            Methods.getUsers(this.hostUrl, this.apiKey).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets details of a user
     *
     * @returns {Promise<unknown>}
     * @param {Integer} userId
     */
    getUserDetails(userId) {
        return new Promise((res, rej) => {
            Methods.getUser(this.hostUrl, this.apiKey, userId).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets details of a user by username
     *
     * @returns {Promise<unknown>}
     * @param {String} username
     */
    getUserByUsername(username) {
        return new Promise(async (res, rej) => {
            await Methods.getUsers(this.hostUrl, this.apiKey).then(async (response) => {
                let user = false;
                let pages = response.data.meta.pagination.total_pages
                for (let i = 0; i !== pages; i++) {
                    await Methods.getUserPage(this.hostUrl, this.apiKey, i).then(page => {
                        user = page.data.data.find(d => d.attributes.username === username)
                    }).catch(err => rej(this.processError(err)));
                }
                return res(user);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets details of a user
     *
     * @returns {Promise<unknown>}
     * @param {String} email
     */
    getUserByEmail(email) {
        return new Promise(async (res, rej) => {
            await Methods.getUsers(this.hostUrl, this.apiKey).then(async (response) => {
                let user = false;
                let pages = response.data.meta.pagination.total_pages
                for (let i = 0; i !== pages; i++) {
                    await Methods.getUserPage(this.hostUrl, this.apiKey, i).then(page => {
                        user = page.data.data.find(d => d.attributes.email === email)
                    }).catch(err => rej(this.processError(err)));
                }
                return res(user);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets users by a specified page number
     *
     * This will return an empty array if the specified page was invalid.
     *
     * @param pageNum
     * @returns {Promise<unknown>}
     */
    getUserPage(pageNum) {
        return new Promise((res, rej) => {
            Methods.getUserPage(this.hostUrl, this.apiKey, pageNum).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Creates a user
     *
     * @param {String} Username Users username
     * @param {String} Email Users email
     * @param {String} FirstName Users first name
     * @param {String} LastName Users last name
     * @returns {Promise<unknown>}
     */
    createUser(Email,Username,FirstName,LastName) {
        return new Promise((res, rej) => {
            Methods.createUser(this.hostUrl, this.apiKey, Email,Username,FirstName,LastName).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * UpdateUserDetails
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} userId
     * @param {String} Email
     * @param {String} Username
     * @param {String} FirstName
     * @param {String} LastName
     * @param {String} Language
     * @param {String} Password
     * @returns {Promise<Boolean>}
     */
    updateUserDetails(userId, Email, Username, FirstName, LastName, Language, Password) {
        return new Promise((res, rej) => {
            Methods.updateUserDetails(this.hostUrl, this.apiKey, userId, Email, Username, FirstName, LastName, Language, Password).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Creates a server
     *
     * @param {String} Version Version of the server to use
     * @param {String} NameOfServer Name of server to create
     * @param {Integer} OwnerID User ID of who should own this server
     * @param {Integer} EggID Egg ID to use when installing the server
     * @param {String} DockerImage The image to use from Docker
     * @param {String} StartupCmd The command to use when starting this server (AKA JVM Arguments)
     * @param {Integer} RAM The amount of RAM the server has
     * @param {Integer} Swap The amount of Swap the server has
     * @param {Integer} Disk The amount of Storage the server has
     * @param {Integer} IO Set this to 500 please. (Even if you know what it is leave it alone)
     * @param {Integer} CPU The amount of CPU Power the server can use (100 = 1 core);
     * @param {Integer} AmountOfDatabases The max amount of databases a server can use
     * @param {Integer} AmountOfBackups The max backups you can hold
     * @param {Integer} AmountOfAllocations The max amount of allocation(s) a server can us
     * @returns {Promise<unknown>}
     */
    createServer(Version, NameOfServer, OwnerID, EggID, DockerImage,
               StartupCmd, RAM, Swap, Disk, IO, CPU,
               AmountOfDatabases, AmountOfBackups, AmountOfAllocations) {
        return new Promise((res, rej) => {
            Methods.createServer(this.hostUrl, this.apiKey, Version, NameOfServer, OwnerID, EggID, DockerImage,
                StartupCmd, RAM, Swap, Disk, IO, CPU,
                AmountOfDatabases, AmountOfBackups, AmountOfAllocations).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Creates a server
     *
     * @param {Integer} OwnerID User ID of who should own this server
     * @param {Integer} EggID Egg ID to use when installing the server
     * @param {Integer} RAM The amount of RAM the server has
     * @param {Integer} Disk The amount of Storage the server has
     * @param {Integer} CPU The amount of CPU Power the server can use (100 = 1 core);
     * @param {Integer} AmountOfDatabases The max amount of databases a server can use
     * @param {Integer} AmountOfBackups The max backups you can hold
     * @param {Integer} AmountOfAllocations The max amount of allocation(s) a server can us
     * @returns {Promise<unknown>}
     */
    createSimpleServer(OwnerID, EggID, RAM, Disk, CPU, AmountOfDatabases, AmountOfBackups, AmountOfAllocations) {
        return new Promise(async (res, rej) => {
            let nest;
            await Methods.getNest(this.hostUrl, this.apiKey, EggID).then(res => nest = res);
            Methods.createServer(this.hostUrl, this.apiKey, "latest", "Server", OwnerID, EggID, nest.data.attributes.docker_image,
                nest.data.attributes.startup, RAM, 0, Disk, 500, CPU,
                AmountOfDatabases, AmountOfBackups, AmountOfAllocations).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets a list of servers from your panel, currently this only get the first page but i will add support for grabbing ALL pages with this methods
     *
     * @returns {Promise<unknown>}
     */
    getAllServers() {
        return new Promise((res, rej) => {
            Methods.getServers(this.hostUrl, this.apiKey).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Gets servers by a specified page number
     *
     * This will return an empty array if the specified page was invalid.
     *
     * @param {Integer} pageNum
     * @returns {Promise<unknown>}
     */
    getServerPage(pageNum) {
        return new Promise((res, rej) => {
            Methods.getServerPage(this.hostUrl, this.apiKey, pageNum).then((response) => {
                return res(response.data.data);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Gets a info of a server from your panel
     *
     * @param {Integer} serverId
     * @returns {Promise<unknown>}
     */
    getServerDetails(serverId) {
        return new Promise((res, rej) => {
            Methods.getServerDetails(this.hostUrl, this.apiKey, serverId).then((response) => {
                return res(response.data.attributes);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Deletes a specified user
     *
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     * However do not this value will NEVER be false. To catch an error for this request you check if the caught error === 404, this will mean
     * the provided API key was non existing.
     *
     * MUST USE ClientAPI Key!!! Application API Keys NO LONGER WORK with ANY Pterodactyl version 1 and above!
     *
     * @param userId
     * @returns {Promise<Boolean>}
     */
    deleteUser(userId) {
        return new Promise((res, rej) => {
            Methods.deleteUser(this.hostUrl, this.apiKey, userId).then(() => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Suspend a server if the host and api key have permission
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} serverId
     * @returns {Promise<Boolean>}
     */
    suspendServer(serverId) {
        return new Promise((res, rej) => {
            Methods.suspendServer(this.hostUrl, this.apiKey, serverId).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Unsuspend a server if the host and api key have permission
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} serverId
     * @returns {Promise<Boolean>}
     */
    unsuspendServer(serverId) {
        return new Promise((res, rej) => {
            Methods.unsuspendServer(this.hostUrl, this.apiKey, serverId).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Reinstall a server if the host and api key have permission
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} serverId
     * @returns {Promise<Boolean>}
     */
    reinstallServer(serverId) {
        return new Promise((res, rej) => {
            Methods.reinstallServer(this.hostUrl, this.apiKey, serverId).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * UpdateServerDetails
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} serverId
     * @param {String} Name
     * @param {Integer} userId
     * @param {Integer} externalId
     * @param {String} Description
     * @returns {Promise<Boolean>}
     */
    updateServerDetails(serverId, Name, userId, externalId, Description) {
        return new Promise((res, rej) => {
            Methods.updateServerDetails(this.hostUrl, this.apiKey, serverId, Name, userId, externalId, Description).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * UpdateServerBuild
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     *
     * @param {Integer} serverId
     * @param {Integer} AllocationID
     * @param {Integer} RAM
     * @param {Integer} Swap
     * @param {Integer} IO
     * @param {Integer} CPU
     * @param {Integer} Disk
     * @param {Integer} Threads
     * @param {Integer} AmountOfDatabases
     * @param {Integer} AmountOfBackups
     * @param {Integer} AmountOfAllocations
     * @returns {Promise<Boolean>}
     */
    updateServerBuild(serverId, AllocationID, RAM, Swap, IO, CPU, Disk, Threads, AmountOfDatabases, AmountOfBackups, AmountOfAllocations) {
        return new Promise((res, rej) => {
            Methods.updateServerBuild(this.hostUrl, this.apiKey, serverId, AllocationID, RAM, Swap, IO, CPU, Disk, Threads, AmountOfDatabases, AmountOfBackups, AmountOfAllocations).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * UpdateServerStartup
     *
     * This update the startup details for a specified server
     *
     * @param serverId ID of serer
     * @param StartupCmd new startup command to use for this server
     * @param Environment The environment object for this server to use
     * @param Egg Egg ID for this serer to use
     * @param DockerImage Docker Image for this serer
     * @param SkipScripts Do you want to skip scripts? (have no idea what this is)
     * @returns {Promise<unknown>}
     */
    updateServerStartup(serverId, StartupCmd, Environment, Egg, DockerImage, SkipScripts) {
        return new Promise((res, rej) => {
            Methods.updateServerStartup(this.hostUrl, this.apiKey, serverId, StartupCmd, Environment, Egg, DockerImage, SkipScripts).then((response) => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        })
    }

    /**
     * Deletes a specified server
     *
     * By default Pterodactyl API returns a empty string on success (""), i altered the response to make it a boolean value of "true"
     * However do not this value will NEVER be false. To catch an error for this request you check if the caught error === 404, this will mean
     * the provided API key was non existing.
     *
     * MUST USE ClientAPI Key!!! Application API Keys NO LONGER WORK with ANY Pterodactyl version 1 and above!
     *
     * @param serverId
     * @returns {Promise<Boolean>}
     */
    deleteServer(serverId) {
        return new Promise((res, rej) => {
            Methods.deleteServer(this.hostUrl, this.apiKey, serverId).then(() => {
                return res(true);
            }).catch(err => rej(this.processError(err)));
        });
    }

    /**
     * Gets details of a nest
     *
     * @returns {Promise<unknown>}
     * @param {Integer} nestId
     */
    getNestDetails(nestId) {
        return new Promise((res, rej) => {
            Methods.getNest(this.hostUrl, this.apiKey, nestId).then((response) => {
                return res(response.data);
            }).catch(err => rej(this.processError(err)));
        })
    }


}

module.exports = Application;
