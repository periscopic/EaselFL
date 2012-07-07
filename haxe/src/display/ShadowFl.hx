package display;

import interfaces.IExec;

class ShadowFl implements IExec {

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		//execs.set('img', setImage);
	}
}
