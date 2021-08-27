// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import {toSerieses, toStories, toVolumes} from "../util/to-model-types";

// Public Objects ------------------------------------------------------------

class Author {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.library_id = data.library_id;
        this.notes = data.notes;
        this.principal = this.calculatePrincipal(data);
        this.series = data.series ? toSerieses(data.series) : [];
        this.stories = data.stories ? toStories(data.stories) : [];
        this.volumes = data.volumes ? toVolumes(data.volumes) : [];
    }

    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    library_id: number;
    notes: string;
    principal: boolean;
    series: Series[];
    stories: Story[];
    volumes: Volume[];

    private calculatePrincipal(data: any): boolean {
        if (data.principal !== undefined) {
            return data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            return data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            return data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            return data.AuthorVolume.principal;
        } else {
            return false;
        }
    }

}

export default Author;
