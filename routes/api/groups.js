const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Group = require('../../models/Groups');
const User = require('../../models/Users');
const auth = require('../../middleware/auth');

// @route   POST api/groups/create
// @desc    Create a group
// @access  Private
router.post('/create', [
    auth, 
    [
        check('name', 'A group name is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const group = new Group({
            owner: req.user.id,
            name: req.body.name
        })
    
        group.members.unshift(req.user.id);
    
        await group.save();

        res.json(group);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/groups/:id/
// @desc    View group info by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const group = await Group.findOne({
            _id: req.params.id
        });
    
        if (!group) return res.status(400).json({ msg: 'Group not found' });
  
        // Check to see if currently logged in user is part of group - stops random people viewing your group
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        res.json(group);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Group not found' });
        }
        res.status(500).send('Server Error');
    }
  });

// @route   GET api/groups/
// @desc    View all groups owned by logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
      const group = await Group.find({
        owner: req.user.id
      });
  
      if (!group) return res.status(400).json({ msg: 'Groups not found' });
  
      res.json(group);
    } catch (error) {
      console.error(error.message);
      if (error.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Groups not found' });
      }
      res.status(500).send('Server Error');
    }
  });

// @route   POST api/groups/:id/add
// @desc    Add user to group with email
// @access  Private
router.post('/:id/add', [
    auth, 
    [
        check('email', 'You must enter an email address').not().isEmpty().isEmail(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;

    try {
        // Find group
        const group = await Group.findOne({ _id:req.params.id })

        // Check to see if currently logged in user is part of group - stops random people adding themselves to groups
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        // Check to see if the user exists
        let user = await User.findOne({ email }); 

        // If user doesn't exist - show error for now - TODO send email to ask user to sign up
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Cannot find user' }] });
        }

        // If user already in group, don't add them again
        const userCheck = group.members.find(member => member.id === user.id);
        if(userCheck) {
            return res.status(400).json({ errors: [{ msg: 'User already member of group' }] });
        }

        group.members.unshift(user);

        group.save();

        res.json(group);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    }
);

// @route   GET api/groups/:id/members
// @desc    Get members within a group
// @access  Private
router.get('/:id/members', auth, async (req, res) => {
    try {
        // Find group
        const group = await Group.findById(req.params.id)

        // Check to see if currently logged in user is part of group - stops random people viewing the groups members
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        const members = group.members;

        res.json(members);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/groups/:id/
// @desc    Delete entire group
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find group
        const group = await Group.findById(req.params.id)

        // If group doesn't exist, throw error
        if(!group) {
            return res.status(400).json({ errors: [{ msg: 'Group does not exist' }] });
        }

        // Check to see if currently logged in user is part of group - stops random people deleting groups
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        await Group.findOneAndRemove({ _id: req.params.id});
  
        res.json({ msg: 'Group deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}); 

// TODO - add functionality to stop normal members removing the owner and stop the owner deleting themselves from the members list
// Right now anyone can remove anyone - need to tighten this up a bit
// @route   DELETE api/groups/:id/:member_id
// @desc    Delete group member
// @access  Private
router.delete('/:id/:member_id', auth, async (req, res) => {
    try {
        // Find group
        const group = await Group.findById(req.params.id)

        // If group doesn't exist, throw error
        if(!group) {
            return res.status(400).json({ errors: [{ msg: 'Group does not exist' }] });
        }

        // Check to see if currently logged in user is part of group - stops random people deleting members
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        const member = group.members.find(
            member => member.id === req.params.member_id
        );
      
        // Make sure member exists
        if (!member) {
            return res.status(404).json({ msg: 'Member is not part of group' });
        }

        // Get remove index
        const removeIndex = group.members
            .map(member => member.id)
            .indexOf(req.params.member_id);

        group.members.splice(removeIndex, 1);

        await group.save();

        res.json({ msg: 'Member removed' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;