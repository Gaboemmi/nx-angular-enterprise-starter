/** Public, non-sensitive attributes used to evaluate a feature flag. */
export interface FeatureFlagContext {
  readonly userId?: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly locale?: string;
  readonly country?: string;
  readonly roles?: readonly string[];
}
