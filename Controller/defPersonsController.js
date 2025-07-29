const { default: axios } = require("axios");
const prisma = require("../DB/db.config");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

exports.defPersons = async (req, res) => {
  try {
    const result = await prisma.def_persons.findMany({
      //sorting desc
      orderBy: {
        user_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Lazy Loading
exports.lazyLoadingDefPersons = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/defpersons/${page}/${limit}`,
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

//Search Lazy Loading
exports.searchLazyLoadingDefPersons = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/defpersons/search/${page}/${limit}?name=${name}
`,
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

exports.uniqueDefPerson = async (req, res) => {
  try {
    const defPersonID = Number(req.params.id);

    const findDefPerson = await prisma.def_persons.findUnique({
      where: {
        user_id: defPersonID,
      },
    });

    if (!findDefPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    return res.status(200).json(findDefPerson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createDerPerson = async (req, res) => {
  try {
    const defPersonData = req.body;

    const persons = await prisma.def_persons.findMany();
    //find max id
    const id =
      persons.length > 0
        ? Math.max(...persons.map((item) => item.user_id)) + 1
        : 1;

    if (!defPersonData.first_name || !defPersonData.job_title) {
      return res
        .status(422)
        .json({ message: "First_name and job_title is required" });
    }

    const newDefPerson = await prisma.def_persons.create({
      data: {
        user_id: id,
        first_name: defPersonData.first_name,
        middle_name: defPersonData.middle_name,
        last_name: defPersonData.last_name,
        job_title: defPersonData.job_title,
      },
    });

    return res.status(201).json(newDefPerson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefPerson = async (req, res) => {
  try {
    const defPersonID = Number(req.params.id);

    const findDefPerson = await prisma.def_persons.findUnique({
      where: {
        user_id: defPersonID,
      },
    });

    if (!findDefPerson) {
      return res.status(404).json({ error: "Person not found" });
    }

    await prisma.def_persons.delete({
      where: {
        user_id: defPersonID,
      },
    });

    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDefPerson = async (req, res) => {
  try {
    const defPersonID = Number(req.params.id);
    const defPersonData = req.body;

    const findDefPerson = await prisma.def_persons.findUnique({
      where: {
        user_id: defPersonID,
      },
    });

    if (!findDefPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    if (!defPersonData.first_name || !defPersonData.job_title) {
      return res
        .status(422)
        .json({ message: "first_name and job_title is required" });
    }

    const updatedDefPerson = await prisma.def_persons.update({
      where: {
        user_id: defPersonID,
      },
      data: {
        first_name: defPersonData.first_name,
        middle_name: defPersonData.middle_name,
        last_name: defPersonData.last_name,
        job_title: defPersonData.job_title,
      },
    });

    return res.status(200).json(updatedDefPerson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
