const express = require('express');
const router = express.Router();

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 900, deleteOnExpire: true});
const axios = require('axios');
const dataUrl = 'https://api.hatchways.io/assessment/blog/posts';

const validSortBy = ['id', 'reads', 'likes', 'popularity'];
const validDirection = ['asc', 'desc'];

/* GET posts. */
router.get('/', function(req, res, next) {
    let {tags, sortBy, direction} = req.query;
    
    if (tags === undefined || tags.length === 0) {
        return res.status(400).json({error: 'Tags parameter is required'});
    } 

    if (sortBy === undefined) {
        sortBy = 'id';
    }
    else {
        // if sortBy is in query but invalid
        if (!validSortBy.includes(sortBy.toLowerCase())) {
            return res.status(400).json({error: `sortBy parameter is invalid: it must be one of "${validSortBy.join(", ")}".`});
        }
    }

    if (direction === undefined) {
        direction = 'asc';
    }
    else {
        // if direction is in query but invalid
        if (!validDirection.includes(direction.toLowerCase())) {
            return res.status(400).json({error: `Direction parameter is invalid: it must be one of "${validDirection.join(", ")}".`});
        }
    }

    // remove duplicate tags and whitespace in query and sort tags
    const tagSet = new Set(tags.split(','));
    tags = [...tagSet].map( t => t.trim().toLowerCase());
    tags.sort( (a,b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

    // return from cache if present
    const tagsStr = tags.join(',');
    const cachedPosts =  cache.get(tagsStr);
    if (cachedPosts !== undefined) {
        return res.json({posts: cachedPosts});
    }

    const promises = tags.map( t => axios.get(dataUrl, { params: { tag: t }}));

    Promise.all(promises).then( responses => {
        let posts = [];
        let ids = new Set();

        responses.forEach( r => {
            r.data.posts.forEach( p => {
                // add post only if not already present
                if (!ids.has(p.id)) {
                    posts.push(p);
                    ids.add(p.id);
                }
            })
        })

        if (direction === 'asc') {
            posts.sort( (a,b) => a[sortBy] - b[sortBy]);
        }
        else {
            posts.sort( (a,b) => b[sortBy] - a[sortBy]);
        }
    
        cache.set(tagsStr, posts);

        res.json({posts: posts});
    })
    .catch( err => {
        console.error(err);
        return res.json({error: err});
    });
});

module.exports = router;
