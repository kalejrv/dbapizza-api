import { StatusRepository } from "@repositories";
import { StatusService } from "@services";
import { IStatusRepository, IStatusService, ServerStatusMessage, Status, StatusOption } from "@types";
import { isAValidId } from "@utils";
import { Request, Response } from "express";

const statusRepository: IStatusRepository = new StatusRepository();
const statusService: IStatusService = new StatusService(statusRepository);

const findStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const status = await statusService.findStatus();

    if (status.length === 0) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: "No status found.",
      });

      return;
    };

    res.status(200).json({
      status: "OK",
      data: status,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const findStatusById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
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
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const createStatus = async (req: Request, res: Response): Promise<void> => {
  const newStatus: Status = req.body;
  
  for (const el of Object.values(newStatus)) {
    if (String(el).trim().length === 0) {
      res.status(400).json({
        status: ServerStatusMessage.BAD_REQUEST,
        msg: "Status fields can not to be empty values.",
      });

      return;
    };
  };

  const { name, description } = newStatus;
  if (!name || name.trim().length === 0)  {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "A status name is neccesary.",
    });
    
    return;
  };

  const statusOptions: string = Object.values(StatusOption).reduce((prev, curr) => prev += curr + ", ", "");
  if (!Object.values(StatusOption).includes(name as StatusOption)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Status name must to be: ${statusOptions.slice(0, statusOptions.length - 2)}.`,
    });

    return;
  };

  try {
    const statusExists = await statusService.findStatusByName(name);
    
    if (statusExists) {
      res.status(200).json({
        status: ServerStatusMessage.OK,
        msg: `Already exists '${statusExists.name}' as a status.`,
      });

      return;
    };

    const status = await statusService.createStatus({
      ...newStatus,
      description: description || "No description.",
    });

    res.status(201).json({
      stauts: ServerStatusMessage.CREATED,
      msg: "Status created successfully.",
      data: status,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });
    
    return;
  };
  
  const updates: Status = req.body;
  const { name } = updates;
  if (!name || name.trim().length === 0) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Status name is required.",
    });
    
    return;
  };
  
  if (!Object.values(StatusOption).includes(name as StatusOption)) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: `Status name must to be: ${StatusOption.Pending}, ${StatusOption.InProgress} or ${StatusOption.Done}.`,
    });

    return;
  };

  try {
    const statusExists = await statusService.findStatusById(id);
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not status found.",
      });

      return;
    };

    const statusUpdated = await statusService.updateStatus(id, {
      ...updates,
      description: updates.description || "No description.",
    });

    res.status(201).json({
      status: ServerStatusMessage.CREATED,
      msg: "Status updated successfully.",
      data: statusUpdated,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
    });
  };
};

const deleteStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const validId = isAValidId(id);
  if (!validId) {
    res.status(400).json({
      status: ServerStatusMessage.BAD_REQUEST,
      msg: "Invalid Id.",
    });

    return;
  };

  try {
    const statusExists = await statusService.findStatusById(id);
    if (!statusExists) {
      res.status(404).json({
        status: ServerStatusMessage.NOT_FOUND,
        msg: "Not status found.",
      });

      return;
    };

    await statusService.deleteStatus(id);

    res.status(200).json({
      status: ServerStatusMessage.OK,
      msg: "Status deleted successfully.",
    });
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      status: ServerStatusMessage.FAILED,
      error,
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
