const expressAsyncHandler = require("express-async-handler");
const complaint = require("../models/complaintSchema");

// create a complaint done bty citizen
const createComplaint = expressAsyncHandler(async (req, res) => {
  const { email, role } = req.user;
  const { description, image, department, district } = req.body;
  try {
    if (role == "citizen") {
      const complain = await complaint.create({
        raisedBy: email,
        description,
        image,
        department,
        district,
      });
      res.status(200).json(complain);
    } else {
      res.status(404).json("only user can sent the complain");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// the complaint which is seen by nodal officer and user also
const getComplaints = expressAsyncHandler(async (req, res) => {
  try {
    const { designation, role, email } = req.user;
    if (role === "citizen") {
      const complain = await complaint.find({ raisedBy: email });
      res.status(200).json(complain);
    } else if (role === "officer") {
      if (designation[0] == "nodalofficer") {
        // match complaint's dept, dist with officers whose dept, dist and design[0]==nodalofficer
        const complain = await complaint.find({
          district: designation[1],
          department: designation[2],
          status: "UN-RESOLVED",
        });
        res.status(200).json(complain);
      } else {
        //TODO: this sends complains where current officer is added at any node of the pathToTravel we want it to go one by one as the officers mark it done
        const complain = await complaint.find({
          pathToTravel: {
            $elemMatch: {
              assignedDept: designation[2],
              assignedDist: designation[1],
              assignedPost: designation[0],
            },
          },
        });
        res.status(200).json(complain);
      }
    } else {
      res.status(404).json("no compliant found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// nodal officer add description
const addNodalDescription = expressAsyncHandler(async (req, res) => {
  const complainId = req.params.id;
  const { designation } = req.user;
  const { description } = req.body;
  try {
    if (designation[0] == "nodalofficer") {
      const complain = await complain.findById(complainId);
      if (complain) {
        complain.descriptionByNodalOfficer = description;

        await complain.save();

        res.status(200).json("nodal officer add the description");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// add pathToTravel and description of particular complaint done byNodalOfficer
const addNodeToPath = expressAsyncHandler(async (req, res) => {
  const complainId = req.params.id;
  console.log(complainId);
  const { designation, name, email, role } = req.user;
  const { department, post, district } = req.body;

  const complain = await complaint.findById(complainId);

  try {
    if (designation[0] == "nodalofficer" && complain) {
      complain.pathToTravel.push({
        assignedDept: department,
        assignedDist: district,
        assignedPost: post,
      });
      // complain.descriptionByNodalOfficer=description;
      await complain.save();

      res.status(200).json("path and desciption has been added to complain");
    } else {
      res.status(404).json("you are not required to perform opertion");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// add commments to a particular complaint
const addComment = expressAsyncHandler(async (req, res) => {
  const complainId = req.params.id;
  const { email, name, role } = req.user;
  const { comment } = req.body;
  try {
    const complain = await complaint.findById(complainId);
    if (complain) {
      complain.comments.push({
        comment: comment,
        commentBy: name,
      });

      await complain.save();
      res.status(200).json("add commment on complain");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//show thw all complain belong to the particular officer/department in the partcular district
// const complaintAssignedToOfficer = expressAsyncHandler(async (req, res) => {
//   const { designation, name, email } = req.user;
//   try {
//     //TODO: refactor dont use filter
//     const complain = await complaint.find({ district: designation[1] });
//     if (complain) {
//       const filterComplaint = complain.filter((comp) => {
//         return comp.pathToTravel.some(
//           (dept) => designation[2] === dept.assignedDept
//         );
//       });
//       if (filterComplaint) {
//         return res.status(200).json(filterComplaint);
//       } else {
//         return res.json(404).json("no filter complain found");
//       }
//     } else {
//       console.log("no complain found");
//       return res.status(400).json("no complain found");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// particular officer update the the status of complaint solved
// TODO :HOW WE UODATE MARK AS DONE
const markAsDone = expressAsyncHandler(async (req, res) => {
  const complainId = req.params.id;
  // see which officer logged in
  const { designation, name, email, role } = req.user;
  try {
    const complain = await complaint.findById(complainId);
    if (complain && role == "officer") {
      complain.pathToTravel = complain.pathToTravel.map((node) => {
        if (
          node.assignedDept === designation[2] &&
          node.assignedDist === designation[1] &&
          node.assignedPost === designation[0]
        ) {
          node.markDone = true;
        }
        return node;
      });
      let cnt = 0;
      complain.pathToTravel.forEach((node) => {
        if (node.markDone === true) {
          cnt++;
        }
      });
      if (cnt === complain.pathToTravel.length) {
        complain.status = "PARTIALLY-RESOLVED";
        //TODO: notify the user that complain is resolved from govt's end
      }
      await complain.save();
      res.status(200).json(complain);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const userMarkComplaintStatusResolved = expressAsyncHandler(
  async (req, res) => {
    const complainId = req.params.id;
    const { role } = req.user;
    try {
      if (role === "citizen") {
        const complain = await complaint.findById(complainId);
        if (complain.status === "PARTIALLY-RESOLVED") {
          complain.status = "RESOLVED";
        }
        await complain.save();
        res.status(200).json(complain);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = {
  createComplaint,
  getComplaints,
  // complaintAssignedToOfficer,
  addComment,
  addNodeToPath,
  addNodalDescription,
  markAsDone,
  userMarkComplaintStatusResolved,
};
