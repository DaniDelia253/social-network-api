const User = require('../../models/User');
const router = require('express').Router();

router.get('/', (req, res) => {
    User.find({})
        .then(dbUser => {
            res.json(dbUser)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .populate({ path: 'friends', select: '-__v' })
        .populate({ path: 'thoughts', select: '-__v', populate: { path: 'reactions' } })
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found with this id!' })
                return
            }
            res.json(dbUser)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/', (req, res) => {
    User.create(req.body)
        .then(dbUser => {
            res.json(dbUser)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/:id', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
            new: true,
            runValidators: true
        }
    )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.delete('/:id', (req, res) => {
    User.findOneAndDelete({ _id: req.params.id })
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.post('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, { new: true, runValidators: true })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true, runValidators: true })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err))
});

module.exports = router;