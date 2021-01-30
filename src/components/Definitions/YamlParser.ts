import yaml from 'js-yaml'

import {readTextFile} from 'tauri/api/fs'

export enum Category {
    Master,
    Shared,
    Init
}

type TopLevelYaml = {
    include?: [string],
    master?: [Definition],
    shared?: [Definition],
    init?: [Definition]
}

export type Definition = {
    type: string,
    var_name?: string,
    var_units?: string,
    event_param?: string,
    event_name?: string,
    // Calculator
    get?: string,
    set?: string,
    interpolate?: string,
    unreliable?: boolean
}

export type ResultDefinition = {
    category: Category,
    definition: Definition
}

export default class YamlParser {
    relativePath: string
    targetPath: string

    definitions: Array<ResultDefinition> = []

    constructor(targetPath: string) {
        this.relativePath = this.getRelativePath(targetPath) ?? ""
        this.targetPath = targetPath        
    }

    private getRelativePath(targetPath: string): null | string {
        const pathComponents = targetPath.split("\\")

        if (pathComponents.length > 3) {
            return pathComponents.slice(0, -3).join("\\")
        }

        return null
    }

    private addDefinition(category: Category, definition: Definition) {
        this.definitions.push({
            category,
            definition
        })
    }

    private parseCategory(category: Category, categoryDefinitions?: [Definition]) {
        if (!categoryDefinitions) {return}
        
        categoryDefinitions.forEach(definition => {
            this.addDefinition(category, definition)
        })
    }

    private async parseYaml(yaml: TopLevelYaml): Promise<void> {
        if (yaml.include) {
            for (const index in yaml.include) {
                await this.parseFile(this.relativePath + "\\" + yaml.include[index])
            }
        }

        this.parseCategory(Category.Init, yaml.init);
        this.parseCategory(Category.Shared, yaml.shared);
        this.parseCategory(Category.Master, yaml.master);
    }

    private async parseFile(path: string): Promise<void> {
        const valueString = await readTextFile(path)
        if (valueString) {
            const value = yaml.load(valueString)

            if (value) {
                return this.parseYaml(value as TopLevelYaml)
            }
        }
    }

    public parse(): Promise<Array<ResultDefinition>> {
        return this.parseFile(this.targetPath)
                .then(() => this.definitions)
    }
}