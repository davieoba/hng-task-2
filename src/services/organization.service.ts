import BaseResponseHandler from "../controllers/base-controllers/BaseResponseHandler.controller"
import db from "../db"
import {
  NewOrgType,
  NewUserToOrganization,
  Organizations,
  usersToOrganizations,
} from "../db/schema/db.schema"

class OrganizationService extends BaseResponseHandler {
  async createOrganization(name: string, userId: string) {
    const orgData: Omit<NewOrgType, "orgId" | "description"> = {
      name: `${name}'s organization`,
      userId: userId,
    }
    const organization: NewOrgType[] = await db
      .insert(Organizations)
      .values(orgData)
      .returning()

    const usersToOrgData: NewUserToOrganization = {
      organizationId: organization[0].orgId as string,
      userId: userId,
    }

    await db.insert(usersToOrganizations).values(usersToOrgData).returning()

    return organization
    // if (!organization) {
    //   const error = new Error("Unable to create Organization")
    //   throw error
    // }
  }
}

export default OrganizationService
