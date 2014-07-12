angular.module('rally.util.lodash.sortedInsert', []).run ->
	_.sortedInsert = (array, value, pluck)->
		index = _.sortedIndex( array, value, pluck )
		array.splice( index, 0, value )
		return array
	_.sortedReverseInsert = (array, value, pluck)->
		_.sortedInsert(array.reverse(), value, pluck)
		return array.reverse()
