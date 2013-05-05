var extend = function (obj1, obj2) 
{
    for (var i in obj2) 
	{
        if (!obj2.hasOwnProperty(i)) 
		{
			continue;
		}
			
		obj1[i] = obj2[i];
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = extend; }