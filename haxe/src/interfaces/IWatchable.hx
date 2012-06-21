package interfaces;

/**
 * Implemented by objects upon which others are dependent 
 * and need to trigger changes when the dependent object changes.
 */
interface IWatchable {
	function watch(method:Dynamic->Void):Void;
	function unwatch(method:Dynamic->Void):Void;
}
