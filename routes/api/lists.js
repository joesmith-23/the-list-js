const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Group = require('../../models/Groups');
const User = require('../../models/Users');
const List = require('../../models/Lists');
const auth = require('../../middleware/auth');

// @route   POST api/lists/:group_id/add
// @desc    Create a list within a group
// @access  Private

router.post('/:group_id/add', [
    auth, 
    [
        check('name', 'You must enter a name for your list').not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    try {
        // Find group
        const group = await Group.findOne({ _id:req.params.group_id })

        // Check to see if currently logged in user is part of group - stops random people viewing the groups members
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }

        const { name } = req.body;

        const newList = new List ({
            group,
            name
        })

        const list = await newList.save();

        res.json(list)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// @route   GET api/lists/:group_id/
// @desc    Get lists within a group
// @access  Private
router.get('/:group_id/', auth, async (req, res) => {
    try {
        // Find group
        const group = await Group.findById(req.params.group_id)

        // Check to see if currently logged in user is part of group - stops random people viewing the groups members
        // const currentUser = req.user.id;
        // const currentUserCheck = group.members.find(member => member.id === currentUser);
        // if(!currentUserCheck) {
        //     return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        // }

        // TODO - refactor all this stuff
        partOfGroup(req.user.id, group)

        const lists = await List.find({ group });

        res.json(lists);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Lists not found' });
          }
        res.status(500).send('Server Error');
    }
});

// TODO probably some edge cases to do here
// @route   DELETE api/lists/:id/
// @desc    Delete list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find list
        const list = await List.findById(req.params.id)

        // If list doesn't exist, throw error
        if(!list) {
            return res.status(400).json({ errors: [{ msg: 'List not found' }] });
        }

        await List.findOneAndRemove({ _id: req.params.id});
  
        res.json({ msg: 'List deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Lists not found' });
          }
        res.status(500).send('Server Error');
    }
}); 

// @route    POST api/lists/items/:id/:list_id
// @desc     Add an item to a list
// @access   Private
router.post('/items/:id/:list_id',
        [
      auth,
      [
        check('name', 'This is required')
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        // Find group
        const group = await Group.findById(req.params.id)

        // Check to see if currently logged in user is part of group - stops random people viewing the groups members
        const currentUser = req.user.id;
        const currentUserCheck = group.members.find(member => member.id === currentUser);
        if(!currentUserCheck) {
            return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
        }
  
        // Find list
        const list = await List.findById(req.params.list_id)

        const newItem = {
          name: req.body.name,
        };
  
        list.items.unshift(newItem);
  
        await list.save();
  
        res.json(list);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    }
  );


// @route    DELETE api/lists/items/:id/:list_id/:item_id
// @desc     Delete an item
// @access   Private
router.delete('/items/:id/:list_id/:item_id', auth, async (req, res) => {
  try {
    // Find group
    const group = await Group.findById(req.params.id)

    // Check to see if currently logged in user is part of group - stops random people viewing the groups members
    const currentUser = req.user.id;
    const currentUserCheck = group.members.find(member => member.id === currentUser);
    if(!currentUserCheck) {
        return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
    }

    // Find list
    const list = await List.findById(req.params.list_id)

    // Pull out item
    const item = list.items.find(
      item => item.id === req.params.item_id
    );

    // Make sure item exists
    if (!item) {
      return res.status(404).json({ msg: 'That does not exist' });
    }

    // Get remove index
    const removeIndex = list.items
      .map(item => item.id)
      .indexOf(req.params.item_id);

    list.items.splice(removeIndex, 1);

    await list.save();

    res.json(list.items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/lists/items/ratings/:id/:list_id/:item_id
// @desc     Add a rating to an item
// @access   Private
router.post(
  '/items/ratings/:id/:list_id/:item_id',
  [
    auth,
    [
      check('value', 'A rating is required between 0 and 10')
        .isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find group
      const group = await Group.findById(req.params.id)

      // Check to see if currently logged in user is part of group - stops random people viewing the groups members
      const currentUser = req.user.id;
      const currentUserCheck = group.members.find(member => member.id === currentUser);
      if(!currentUserCheck) {
          return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
      }

      // Finds user as each rating has a user id associated with it
      const user = await User.findById(req.user.id).select('-password');

      // Find list
      const list = await List.findById(req.params.list_id)
      // Find item
      const item = list.items.find(item => item.id === req.params.item_id);

      // Get rating value from req.body
      const value = req.body.value;

      if(value < 0 || value > 10) {
        return res.status(400).json({ errors: [{ msg: 'A rating is required between 0 and 10' }] });
      }

      // Check if the item has already been rated
      if (
        item.rating.filter(rating => rating.user.toString() === req.user.id).length > 0
      ) {
        return res.status(400).json({ msg: 'You can only rate it once' });
      }
    
      const rating = {
        user,
        value,
      };

      item.rating.unshift(rating);

      await list.save();

      res.json(item.rating);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
); 

// @route    GET api/lists/items/ratings/:id/:list_id/:item_id/
// @desc     Get average rating
// @access   Private
router.get('/:id/:list_id/:item_id/', auth, async (req, res) => {
  try {
      // Find group
      const group = await Group.findById(req.params.id)

      // Check to see if currently logged in user is part of group - stops random people viewing the groups members
      const currentUser = req.user.id;
      const currentUserCheck = group.members.find(member => member.id === currentUser);
      if(!currentUserCheck) {
          return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
      }

      // Find list
      const list = await List.findById(req.params.list_id)
      // Find item
      const item = list.items.find(item => item.id === req.params.item_id);
      // Get ratings
      // const ratings = item.find( {rating} );

      // const averageRating = await List.aggregate( [
      //   { $match: items.rating }
      //   ] 
      // );

      // console.log(list.items)

      // LEARN ABOUT MONGODB AND MONGODB AGGREGATION

      res.json(lists);
  } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Lists not found' });
        }
      res.status(500).send('Server Error');
  }
});


// @route    DELETE api/lists/items/ratings/:id/:list_id/:item_id/rating_id
// @desc     Delete a rating
// @access   Private
router.delete('/items/ratings/:id/:list_id/:item_id/:rating_id', auth, async (req, res) => {
  try {
    // Find group
    const group = await Group.findById(req.params.id)

    // Check to see if currently logged in user is part of group - stops random people viewing the groups members
    const currentUser = req.user.id;
    const currentUserCheck = group.members.find(member => member.id === currentUser);
    if(!currentUserCheck) {
        return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
    }

    // Find list
    const list = await List.findById(req.params.list_id)
    // Find item
    const item = list.items.find(item => item.id === req.params.item_id);
    // Find rating
    const rating = item.rating.find(rating => rating.id === req.params.rating_id);

    if(!rating) {
      return res.status(404).json({ msg: 'Rating does not exist' });
    }

    await rating.remove()
    await list.save()

    res.json(list.items)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


const partOfGroup = (user, group) => {
    const currentUser = user;
    const currentUserCheck = group.members.find(member => member.id === currentUser);
    if(!currentUserCheck) {
        return res.status(400).json({ errors: [{ msg: 'You are not part of this group' }] });
    }
} 

module.exports = router;