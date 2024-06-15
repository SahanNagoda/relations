import { buildFeature } from "adminjs";
import merge from "lodash/merge.js";
import {
  LicenseStatusEnum,
  verifyLicense,
  trackLicenseUsage,
} from "@adminjs/license";
import {
  addManyToManyRelationHandler,
  findRelationHandler,
  redirectToOwningResourceDetails,
  deleteRelationHandler,
  assignManyToManyRelation,
} from "./actions/index.js";
import { emptyLocale, featureTranslations } from "./translations.js";
import { bundleComponent } from "./utils/index.js";
const bundleRelationsComponents = (a) => ({
    show: bundleComponent(a, "RelationsShowPropertyComponent"),
    edit: bundleComponent(a, "RelationsEditPropertyComponent"),
    list: bundleComponent(a, "RelationsListPropertyComponent"),
  }),
  PKG = "@adminjs/relations";
let license = null;
const trackUsage = (a) => {
  license || ((license = a), trackLicenseUsage(license, PKG));
};
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
 */ export const owningRelationSettingsFeature = (a) => {
  var b = Number.MAX_SAFE_INTEGER;
  const {
      componentLoader: c,
      relations: d,
      propertyKey: f = "relations",
      licenseKey: e,
    } = a,
    { show: g, edit: h, list: i } = bundleRelationsComponents(c),
    { status: j, msg: k } = verifyLicense(e, { packageName: PKG });
  if (j === LicenseStatusEnum.Invalid || j === LicenseStatusEnum.NotFound)
    throw new Error(k);
  return (
    trackUsage(e),
    buildFeature(
      (c) => (
        (c.options.locale = merge(
            c.options.locale,
          emptyLocale,
          featureTranslations,
          
        )),
        {
          properties: {
            [f]: {
              isVisible: { show: !0, edit: !1, list: !1 },
              type: "string",
              components: { show: g, edit: h, list: i },
              props: { relations: d },
              position: b,
            },
          },
          actions: {
            findRelation: {
              actionType: "record",
              isVisible: !1,
              handler: findRelationHandler(a),
            },
            addManyToManyRelation: {
              actionType: "record",
              isVisible: !1,
              handler: addManyToManyRelationHandler(a),
            },
            deleteRelation: {
              actionType: "record",
              isVisible: !1,
              handler: deleteRelationHandler(a),
            },
          },
        }
      )
    )
  );
};
export const targetRelationSettingsFeature = () =>
  buildFeature({
    actions: {
      edit: { after: [redirectToOwningResourceDetails] },
      new: {
        after: [assignManyToManyRelation, redirectToOwningResourceDetails],
      },
    },
  });
