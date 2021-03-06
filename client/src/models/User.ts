// User ----------------------------------------------------------------------

// A user who may be authenticated to, and use the features of, this application.

// Public Objects ------------------------------------------------------------

class User {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.level = data.level || "info";
        this.password = data.password || null;
        this.scope = data.scope;
        this.username = data.username;
    }

    id!: number;
    active!: boolean;
    level?: string;
    password?: string;
    scope!: string;
    username!: string;

}

export default User;
