export interface PublicDashboard {
    /**
     * Unique public access token
     */
    accessToken?: string;
    /**
     * Flag that indicates if annotations are enabled
     */
    annotationsEnabled: boolean;
    /**
     * Dashboard unique identifier referenced by this public dashboard
     */
    dashboardUid: string;
    /**
     * Flag that indicates if the public dashboard is enabled
     */
    isEnabled: boolean;
    /**
     * Flag that indicates if the time range picker is enabled
     */
    timeSelectionEnabled: boolean;
    /**
     * Unique public dashboard identifier
     */
    uid: string;
}
