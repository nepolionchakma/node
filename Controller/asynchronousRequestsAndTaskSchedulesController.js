const axios = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;
const pageLimitData = (page, limit) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  let startNumber = 0;
  const endNumber = pageNumber * limitNumber;
  if (pageNumber > 1) {
    const pageInto = pageNumber - 1;
    startNumber = pageInto * limitNumber;
  }
  return { startNumber, endNumber };
};

exports.getTaskSchedules = async (req, res) => {
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/Show_TaskSchedules`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTaskSchedulesLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/Show_TaskSchedules`
    );
    const sortedData = response.data.sort(
      (a, b) => new Date(b?.creation_date) - new Date(a?.creation_date)
    );
    const results = sortedData.slice(startNumber, endNumber);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskSchedule = async (req, res) => {
  const { task_name, arm_param_id } = req.params;
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/Show_TaskSchedule/${task_name}/${arm_param_id}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getViewRequests = async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_ENDPOINT_URL}/view_requests`);
    const sortedData = response.data.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });

    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getViewRequestsLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(`${FLASK_ENDPOINT_URL}/view_requests`);
    const sortedData = response.data.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });
    const results = sortedData.slice(startNumber, endNumber);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createTaskSchedule = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/Create_TaskSchedule`,
      data
    );
    // console.log(response.data.error, "res");
    return res.status(200).json(response.data);
  } catch (error) {
    // console.log(error, "error");
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskSchedule = async (req, res) => {
  const { task_name, redbeat_schedule_name } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/Update_TaskSchedule/${task_name}/${redbeat_schedule_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.cancelTaskSchedule = async (req, res) => {
  const { task_name, redbeat_schedule_name } = req.params;
  console.log(task_name, redbeat_schedule_name, "params");
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/Cancel_TaskSchedule/${task_name}/${redbeat_schedule_name}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// V1 API
exports.getTaskSchedulesV1 = async (req, res) => {
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/api/v1/Show_TaskSchedules`
    );

    const sortedData = response.data.sort(
      (a, b) => b?.arm_task_sche_id - a?.arm_task_sche_id
    );
    return res.status(200).json(sortedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTaskSchedulesLazyLoadingV1 = async (req, res) => {
  const { page, limit } = req.params;
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/api/v1/Show_TaskSchedules`
    );
    // sort by time
    const sortedData = response.data.sort((a, b) => {
      const dateA = new Date(a.creation_date);
      const dateB = new Date(b.creation_date);
      return dateB - dateA;
    });

    const results = sortedData.slice(startNumber, endNumber);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTaskScheduleV1 = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/api/v1/Create_TaskSchedule`,
      data
    );
    console.log(response.data, "res");
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTaskScheduleV1 = async (req, res) => {
  const { task_name } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/api/v1/Update_TaskSchedule/${task_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.cancelTaskScheduleV1 = async (req, res) => {
  const { task_name } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/api/v1/Cancel_TaskSchedule/${task_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
