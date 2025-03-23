const { default: axios } = require("axios");
const { user } = require("../Authentication/Authentication");
const arm_api_url = process.env.ARM_API_URL;

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

exports.getARMTasks = async (req, res) => {
  const response = await axios.get(`${arm_api_url}/Show_Tasks`);
  const sortedData = response.data.sort(
    (a, b) => b?.arm_task_id - a?.arm_task_id
  );
  return res.status(200).json(sortedData);
};

exports.getARMTasksLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { startNumber, endNumber } = pageLimitData(page, limit);
  const response = await axios.get(`${arm_api_url}/Show_Tasks`);

  const sortedData = response.data.sort((a, b) => {
    const dateB = new Date(b.creation_date);
    const dateA = new Date(a.creation_date);
    // console.log(dateA, dateB, "sds");
    return dateB - dateA;
  });

  const results = sortedData.slice(startNumber, endNumber);
  return res.status(200).json(results);
};
exports.getARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  const response = await axios.get(`${arm_api_url}/Show_Task/${task_name}`);
  return res.status(200).json(response.data);
};
exports.registerARMTask = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(`${arm_api_url}/Create_Task`, data);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.editARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  const data = req.body;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_Task/${task_name}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.cancelARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  try {
    const response = await axios.put(`${arm_api_url}/Cancel_Task/${task_name}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Task Params
exports.getTaskNameParams = async (req, res) => {
  const { task_name } = req.params;
  try {
    const response = await axios.get(
      `${arm_api_url}/Show_TaskParams/${task_name}`
    );

    const sortedData = response.data.sort(
      (a, b) => b.arm_task_id - a.arm_task_id
    );
    return res.status(200).json(sortedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getUserTaskNameParams = async (req, res) => {
  const { task_name } = req.params;
  try {
    const response = await axios.get(
      `${arm_api_url}/Show_TaskParams/${task_name}`
    );

    const sortedData = response.data.sort(
      (a, b) => b.arm_task_id - a.arm_task_id
    );
    return res.status(200).json(sortedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getTaskParamsLazyLoading = async (req, res) => {
  const { task_name, page, limit } = req.params;
  try {
    const { startNumber, endNumber } = pageLimitData(page, limit);
    const response = await axios.get(
      `${arm_api_url}/Show_TaskParams/${task_name}`
    );

    const results = response.data.slice(startNumber, endNumber);

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.addTaskParams = async (req, res) => {
  const { task_name } = req.params;
  const data = req.body;
  try {
    const response = await axios.post(
      `${arm_api_url}/Add_TaskParams/${task_name}`,
      data
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateTaskParams = async (req, res) => {
  const { task_name, arm_param_id } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_TaskParams/${task_name}/${arm_param_id}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteTaskParams = async (req, res) => {
  const { task_name, arm_param_id } = req.params;
  try {
    const response = await axios.put(
      `${arm_api_url}/Delete_TaskParams/${task_name}/${arm_param_id}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.showExecutionMethods = async (req, res) => {
  try {
    const response = await axios.get(`${arm_api_url}/Show_ExecutionMethods`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.showExecutionMethodsLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(`${arm_api_url}/Show_ExecutionMethods`);
    const results = response.data.slice(startNumber, endNumber);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.createExecutionMethod = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${arm_api_url}/Create_ExecutionMethod`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.updateExecutionMethod = async (req, res) => {
  const { internal_execution_method } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${arm_api_url}/Update_ExecutionMethod/${internal_execution_method}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
