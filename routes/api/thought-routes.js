const Thought = require('../../models/Thought');
const router = require('express').Router();

router.get('/', (req, res) => {
    Thought.find({})
        .then(dbThought => {
            res.json(dbThought)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.get('/:id', (req, res) => {
    Thought.findOne({ _id: req.params.id })
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'No user found with this id!' })
                return
            }
            res.json(dbThought)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.post('/', (req, res) => {
    Thought.create(req.body)
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
})

router.put('/:id', (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
})

router.delete('/:id', (req, res) => {
    Thought.findOneAndDelete({ _id: req.params.id })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
})

router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: { reactionBody: req.body.reactionBody, username: req.body.username } } },
        { new: true })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))

})


router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }).
        then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(404).json(err))

})



module.exports = router;

