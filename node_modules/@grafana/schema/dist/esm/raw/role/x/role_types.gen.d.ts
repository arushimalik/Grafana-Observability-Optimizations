export interface Role {
    /**
     * Role description
     */
    description?: string;
    /**
     * Optional display
     */
    displayName?: string;
    /**
     * Name of the team.
     */
    groupName?: string;
    /**
     * Do not show this role
     */
    hidden: (boolean | false);
    /**
     * The role identifier `managed:builtins:editor:permissions`
     */
    name: string;
}
