const expressAsyncHandler = require("express-async-handler");
const complaint = require("../models/complaintSchema");

const analytics = expressAsyncHandler(async (req, res) => {
  try {
    const complain = await complaint.find({ status: "RESOLVED" });
    const a = complain.length;

    const complains = await complaint.find({ status: "PARTIALLY-RESOLVED" });
    const b = complains.length;

    const comp = await complaint.find({ status: "UN-RESOLVED" });
    const c = comp.length;

    const result = [
      { name: "solved", value: a },
      { name: "partiallyResolved", value: b },
      { name: "unresolved", value: c },
    ];
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = {
  analytics,
};
