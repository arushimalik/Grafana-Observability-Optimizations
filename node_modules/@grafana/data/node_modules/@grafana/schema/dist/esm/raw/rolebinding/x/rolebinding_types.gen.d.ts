export interface CustomRoleRef {
    kind: 'Role';
    name: string;
}
export interface BuiltinRoleRef {
    kind: 'BuiltinRole';
    name: ('viewer' | 'editor' | 'admin');
}
export interface RoleBindingSubject {
    kind: ('Team' | 'User');
    /**
     * The team/user identifier name
     */
    name: string;
}
export interface RoleBinding {
    /**
     * The role we are discussing
     */
    role: (BuiltinRoleRef | CustomRoleRef);
    /**
     * The team or user that has the specified role
     */
    subject: RoleBindingSubject;
}
