
export enum Campus {
    ELL = 'Ellermanstraat',
    NOO = 'Noorderplaats'
}


export enum Status
{
    OPEN = 'Wachten op ontvangst door logistieke diensten',
    PENDING = 'In behandeling',
    REQUESTED = 'Offerte aangevraagd',
    AWAIT_APPROVAL = 'Wachten op goedkeuring AP',
    EXEC_AP = 'Wordt uitgevoerd door AP',
    EXEC_AP_EXT = 'Wordt uitgevoerd door externe contractor van AP',
    DISCARDED = 'Wordt niet uitgevoerd',
    FINISHED = 'Voltooid',
}

export class Category{
  id: string;
  department: string;
  categories: string[];
}


export class AzureUser {
  azureUserId: string;
  displayName: string;
  Email?: string;
}

export class AzureGroups {
  Id: string;
  displayName: string;
  description: string;
}


export class Order {
    constructor(
        public id?: string,
        public requesterId?: string,
        public requesterName?: string,
        public title?: string,
        public campus?: Campus,
        public floor?:string,
        public location?: string,
        public description?: string,
        public date?: string,
        public time?: string,
        public categoryDepartment?: string,
        public category?: string,
        public status?: Status,
        public statusHistory?:Status[],
        public assignTo?: AzureUser,
        public createdOn?: Date
    ) {}

}
