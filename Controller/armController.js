const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

// ARM Tasks
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
  const response = await axios.get(`${FLASK_ENDPOINT_URL}/def_async_tasks`, {
    headers: {
      Authorization: `Bearer ${req.cookies.access_token}`,
    },
  });

  return res.status(200).json(response.data);
};

exports.getARMTasksLazyLoading = async (req, res) => {
  const { page, limit } = req.params;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_async_tasks/${page}/${limit}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSearchARMTasksLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { user_task_name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_async_tasks/search/${page}/${limit}?user_task_name=${user_task_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  const response = await axios.get(
    `${FLASK_ENDPOINT_URL}/Show_Task/${task_name}`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies.access_token}`,
      },
    }
  );
  return res.status(200).json(response.data);
};
exports.registerARMTask = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/Create_Task`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
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
      `${FLASK_ENDPOINT_URL}/Update_Task/${task_name}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.cancelARMTask = async (req, res) => {
  const task_name = req.params.task_name;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/Cancel_Task/${task_name}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
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
      `${FLASK_ENDPOINT_URL}/Show_TaskParams/${task_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );

    const sortedData = response.data.sort(
      (a, b) => b.def_task_id - a.def_task_id
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
      `${FLASK_ENDPOINT_URL}/Show_TaskParams/${task_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );

    const sortedData = response.data.sort(
      (a, b) => b.def_task_id - a.def_task_id
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
      `${FLASK_ENDPOINT_URL}/Show_TaskParams/${task_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
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
      `${FLASK_ENDPOINT_URL}/Add_TaskParams/${task_name}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateTaskParams = async (req, res) => {
  const { task_name, def_param_id } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/Update_TaskParams/${task_name}/${def_param_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteTaskParams = async (req, res) => {
  const { task_name, def_param_id } = req.params;
  try {
    const response = await axios.delete(
      `${FLASK_ENDPOINT_URL}/Delete_TaskParams/${task_name}/${def_param_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.showExecutionMethods = async (req, res) => {
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/Show_ExecutionMethods`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.showExecutionMethodsLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  // const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/Show_ExecutionMethods/${page}/${limit}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    // console.log(response.data, "response.data");
    // const results = response.data.slice(startNumber, endNumber);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.createExecutionMethod = async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/Create_ExecutionMethod`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
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
      `${FLASK_ENDPOINT_URL}/Update_ExecutionMethod/${internal_execution_method}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteExecutionMethod = async (req, res) => {
  const { internal_execution_method } = req.params;
  console.log(internal_execution_method, "internal_execution_method");
  try {
    const response = await axios.delete(
      `${FLASK_ENDPOINT_URL}/Delete_ExecutionMethod/${internal_execution_method}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    console.log(response.data, "response.data");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
