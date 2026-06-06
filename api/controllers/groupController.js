const Group = require('../models/Group');
const Todo = require('../models/Todo');

const getGroups = async (req, res) => {
  const groups = await Group.find({ user: req.user.id }).sort('order');
  res.json(groups);
};

const createGroup = async (req, res) => {
  const { name, color } = req.body;
  const group = new Group({ name, color, user: req.user.id });
  await group.save();
  res.status(201).json(group);
};

const updateGroup = async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, user: req.user.id });
  if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });
  const { name, color, order } = req.body;
  if (name !== undefined) group.name = name;
  if (color !== undefined) group.color = color;
  if (order !== undefined) group.order = order;
  await group.save();
  res.json(group);
};

const deleteGroup = async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, user: req.user.id });
  if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });
  // Reasignar tareas del grupo a null (sin grupo)
  await Todo.updateMany({ groupId: group._id }, { groupId: null });
  await group.deleteOne();
  res.json({ message: 'Grupo eliminado' });
};

module.exports = { getGroups, createGroup, updateGroup, deleteGroup };