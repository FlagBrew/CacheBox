var request = require("request")


var ignoreRepos = ["flagbrew.github.io", "EventsGalleryPacker", "Cachebox"]


function get_readme(repo, callback) {
	request("https://api.github.com/repos/FlagBrew/" + repo + "/readme",
	{
		json: true,
		headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
	}, function (err, resp, body) {
		if (!err && resp.statusCode === 200) {
			callback(body)
		} else {
			console.log(err)
			console.log(resp.statusCode)
		  }
})
}

function get_releases(repo, callback) {
	request("https://api.github.com/repos/FlagBrew/" + repo + "/releases",
		{
			json: true,
			headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
		}, function (err, resp, body) {
			if (!err && resp.statusCode === 200) {
				callback(body)
			} else {
		  console.log(err)
		  console.log(resp.statusCode)
		}
	})
}

function get_repos(callback) {
	 // first we fetch a list of repos
	 request("https://api.github.com/orgs/FlagBrew/repos", {
		json: true,
		headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
	  }, function (err, resp, body) {
		if (!err && resp.statusCode === 200) {
		  for (var repo in body) {
			  if (!ignoreRepos.includes(body[repo].name) && !body[repo].fork) {
					callback(body[repo].name)
			  }
		  }
		} else {
		  console.log(err)
		  console.log(resp.statusCode)
		}
	  })
}

function get_members(callback) {
	request("https://api.github.com/orgs/FlagBrew/members", {
	 json: true,
	 headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
	 }, function (err, resp, body) {
	 if (!err && resp.statusCode === 200) {
		 for (var member in body) {
			 callback(body[member].login, callback)
		 }
	 } else {
		 console.log(err)
		 console.log(resp.statusCode)
	 }
	 })
}

function get_member(name, callback) {
	request("https://api.github.com/users/" + name,
		{
			json: true,
			headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
		}, function (err, resp, body) {
			if (!err && resp.statusCode === 200) {
				callback(body)
			} else {
		  console.log(err)
		  console.log(resp.statusCode)
		}
	})
}


module.exports = {
	repos: function (callback) {
		get_repos(callback)
	},
	readme: function (repo, callback) {
		get_readme(repo, callback)
	},
	releases: function (repo, callback) {
		get_releases(repo, callback)
	},
	members: function(callback) {
		get_members(callback)
	},
	member: function(name, callback) {
		get_member(name, callback)
	}
}
