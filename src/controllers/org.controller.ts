import { eq } from "drizzle-orm"
import APP_CONSTANTS from "../config/app.constants"
import db from "../db"
import {
  NewOrgType,
  NewUserToOrganization,
  Organizations,
  usersToOrganizations,
} from "../db/schema/db.schema"
import { BAD_REQUEST } from "../extensions/utils/error-response-message"
import BaseApiController from "./base-controllers/BaseApiController.controller"

class OrganizationController extends BaseApiController {
  constructor() {
    super()
  }

  protected initializeServices(): void {}
  protected initializeMiddleware(): void {}
  protected initializeRoutes(): void {
    this.getUserOrganizations("/") // GET ALL ORGANIZATION
    this.getAnOrganization("/:id") // GET A SINGLE ORGANIZATION
    this.userCreateAnOrganization("/") //  USER CREATE AN ORGANIZATION
  }

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

  // GET ALL THE ORGANIZATION THAT THIS USER BELONGS TO
  async getUserOrganizations(path: string) {
    this.router.get(path)
    this.router.get(path, async (req, res) => {
      try {
        const local_user = this.requestUtils.getDataFromState(
          APP_CONSTANTS.USER_LABEL
        )

        const query = await db
          .select({
            orgId: Organizations.orgId,
            name: Organizations.name,
          })
          .from(Organizations)
          .innerJoin(
            usersToOrganizations,
            eq(Organizations.orgId, usersToOrganizations.organizationId)
          )
          .where(eq(usersToOrganizations.userId, local_user.userId))

        const response = {
          organizations: [...query],
        }
        return this.sendSuccessResponse(res, "OK", response, 200)
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 400)
      }
    })
  }

  // GET A SINGLE ORGANIZATION
  async getAnOrganization(path: string) {
    this.router.get(path)
    this.router.get(path, async (req, res) => {
      const id = req.params.id
      try {
        const organizations = await db.query.Organizations.findFirst({
          where(organizations, { eq }) {
            return eq(organizations.orgId, id)
          },
        })
        const response = {
          orgId: organizations?.orgId,
          name: organizations?.name,
          description: organizations?.description,
        }
        return this.sendSuccessResponse(res, "OK", { data: response })
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 400)
      }
    })
  }

  //  CREATE NEW ORGANIZATION ENDPOINT
  async userCreateAnOrganization(path: string) {
    this.router.post(path, this.appValidator.validateOrganization)
    this.router.post(path, async (req, res) => {
      try {
        const user = this.requestUtils.getDataFromState(
          APP_CONSTANTS.USER_LABEL
        )
        const organizationData = {
          name: req.body.name,
          description: req.body.description,
          userId: user.userId,
        }

        const organization = await db
          .insert(Organizations)
          .values(organizationData)
          .returning()

        const usersToOrgData: NewUserToOrganization = {
          organizationId: organization[0].orgId as string,
          userId: user.userId,
        }
        await db.insert(usersToOrganizations).values(usersToOrgData).returning()

        return this.sendSuccessResponse(
          res,
          "Organisation created successfully",
          {
            data: { organization: organization[0] },
          },
          201
        )
      } catch (error: any) {
        this.sendErrorResponse(res, error, BAD_REQUEST, 400)
      }
    })
  }

  // ADD USER TO AN ORGANIZATION
  async addUserToOrganization(path: string) {
    this.router.post(path)
    this.router.post(path, async (req, res) => {
      const id = req.query.id
      // CHECK IF THE ORGANIZATION EXISTS
      const checkIfOrganizationExists = await db.query.Organizations.findFirst({
        where(organizations, { eq }) {
          return eq(organizations.orgId, String(id))
        },
      })

      if (!checkIfOrganizationExists) {
        return this.sendErrorResponse(
          res,
          new Error("Organization does not exist"),
          BAD_REQUEST,
          400
        )
      }

      // CREATE AN INSTANCE ON THE TABLE THAT MATCHES THE USERID
    })
  }
}

export default OrganizationController
