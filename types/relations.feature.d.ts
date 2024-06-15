import { FeatureType } from 'adminjs';
import { RelationsFeatureConfig } from './types/index.js';
/**
 * @example
 * ```
 * export const createOrganizationResource = (): CreateResourceResult<
 *  typeof Organization
 *> => ({
 *  resource: Organization,
 *  features: [
 *    owningRelationSettingsFeature({
 *      componentLoader,
 *      licenseKey: 'xxx',
 *      relations: {
 *        persons: {
 *          junction: {
 *            joinKey: 'personId',
 *            inverseJoinKey: 'organizationId',
 *            throughResourceId: 'PersonOrganization',
 *          },
 *          target: {
 *            resourceId: 'Person',
 *          },
 *        },
 *      },
 *    }),
 *  ],
 *  options: {
 *    navigation: { icon: 'Home' },
 *    actions: {
 *      findRelation: {
 *        isAccessible: true,
 *      },
 *    },
 *  },
 *});
 *```
 */
export declare const owningRelationSettingsFeature: (config: RelationsFeatureConfig) => FeatureType;
export declare const targetRelationSettingsFeature: () => FeatureType;
