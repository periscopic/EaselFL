package interfaces;

interface IExec {
	function exec(method:String, ?arguments:Dynamic=null):Dynamic;
}