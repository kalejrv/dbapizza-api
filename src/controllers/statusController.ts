import { Request, Response } from "express";
import { StatusRepository } from "@repositories";
import { StatusService } from "@services";
import { APIResponse, IStatusRepository, IStatusService, ServerStatusMessage, Status, StatusOption } from "@types";
import { isAValidId } from "@utils";

const statusRepository: IStatusRepository = new StatusRepository();
const statusService: IStatusService = new StatusService(statusRepository);

const findStatus = async (_req: Request, res: Response<APIResponse>): Promise<void> => {
  try {
    /* Validate if there aren't status registered. */
    const status = await statusService.findStatus();
    if (status.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No status found.",
      });

      return;
    };

    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: status,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const findStatusById = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that status id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate if status doesn't exist. */
    const statusExists = await statusService.findStatusById(id);
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not status found.",
      });

      return;
    };
    
    res.status(200).json({
      status: ServerStatusMessage.OK,
      data: statusExists,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const createStatus = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const newStatus: Status = req.body;
  const { name, description } = newStatus;
  
  /* Validate that all status values don't be empty values. */
  for (const key in newStatus) {
    if (newStatus[key as keyof Status].trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Fields can not to be empty values.",
      });

      return;
    };
  };

  /* Validate that all status values be required. */
  if ((Object.values(newStatus).length === 0) || !name || !description) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "All fields are required.",
    });
    
    return;
  };

  /* Validate that status name from request be a valid Status option. */
  const statusOptions: string = Object.values(StatusOption).reduce((prev: string, curr: StatusOption): string => {
    return prev += curr + ", ";
  }, "");
  if (!Object.values(StatusOption).includes(name as StatusOption)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Status name must to be: ${statusOptions.slice(0, statusOptions.length - 2)}.`,
    });

    return;
  };

  try {
    /* Validate that if status exists don't create it again. */
    const statusExists = await statusService.findStatusByName(name);  
    if (statusExists) {
      res.status(409).json({
        status: ServerStatusMessage.CONFLICT,
        msg: `Already exists '${statusExists.name}' as a status.`,
      });

      return;
    };

    /* Create status. */
    const status = await statusService.createStatus(newStatus);

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Status created successfully.",
      data: status,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const updateStatus = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;
  const updates: Partial<Status> = req.body;

  /* Validate that status id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });
    
    return;
  };
  
  /* Validate that updates don't be empty values. */
  for (const key in updates) {
    if ((updates[key as keyof Status] as string).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Updates can not be empty values.",
      });

      return;
    };
  };

  /* Validate that come at least one update value in request. */
  if (Object.values(updates).length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "At least one update value is required.",
    });
    
    return;
  };

  /* Validate that Status name be a valid Status option. */
  if (updates.name && !Object.values(StatusOption).includes(updates.name as StatusOption)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Status name must to be a valid Status option.",
    });

    return;
  };

  try {
    /* Validate that if status doesn't exist isn't possible to update it. */
    const statusExists = await statusService.findStatusById(id);
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not status found.",
      });

      return;
    };

    /* Update status. */
    const statusUpdated = await statusService.updateStatus(id, updates);

    res.status(200).json({
      status: ServerStatusMessage.UPDATED,
      msg: "Status updated successfully.",
      data: statusUpdated,
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

const deleteStatus = async (req: Request, res: Response<APIResponse>): Promise<void> => {
  const { id } = req.params;

  /* Validate that status id be a valid id. */
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    /* Validate that if status doesn't exist isn't possible to delete it. */
    const statusExists = await statusService.findStatusById(id);
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not status found.",
      });

      return;
    };

    /* Delete status. */
    await statusService.deleteStatus(id);

    res.status(200).json({
      status: ServerStatusMessage.DELETED,
      msg: "Status deleted successfully.",
    });
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
    
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      msg: error.message,
    });
  };
};

export {
  findStatus,
  findStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
