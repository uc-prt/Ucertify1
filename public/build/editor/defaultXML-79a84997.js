
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, B as noop } from './main-1b18ba06.js';

/* clsSMEval\defaultXML.svelte generated by Svelte v3.29.0 */

function create_fragment(ctx) {
	const block = {
		c: noop,
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getDefaultXMl(type) {
	var xmls = {
		"editor_item_88.xml": "<SMXML type=\"24\"  name=\"evalPro\" language=\"php\"><editor><?php\nfunction Add($a,$b)\n{\n//write your function here...\n}\n$handle = fopen (\"php://stdin\",\"r\");\n$_a = fgets($handle);\n$_b = fgets($handle);\n$result = Add((int)$_a,(int)$_b);\nprint ($result);\nfclose($handle);\n?></editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"Evalpro\" language=\"java\"><editor>\nimport java.io.*;\nimport java.util.*;\nimport java.text.*;\nimport java.math.*;\nimport java.util.regex.*;\nclass Solution {\nstatic int Add(int a, int b)\n{\n//write your function here...\n}\npublic static void main(String[] args) {\nScanner in = new Scanner(System.in);\nint _a;\n_a = in.nextInt();\nint _b;\n_b = in.nextInt();\nint sum;\nsum = Add(_a, _b);\nSystem.out.println(sum);\n}\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c\"><editor>#include <stdio.h>\nint add(int a,int b)\n{\n//write your function here...\n}\nint main()\n{\nint n1,n2,sum;\nscanf(\"%d %d\",&n1,&n2);\nsum = add(n1, n2);\nprintf(\"%d\",sum);\nreturn 0;\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c++\"><editor>#include <iostream>\nusing namespace std;\nint add(int a,int b)\n{\n//write your function here...\n}\nint main()\n{\nint a,b,c;\ncin >> a;\ncin >> b;\nc=add(a,b);\ncout << c;\nreturn 0;\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c#\"><editor>using System;\nnamespace CsharpPrograms\n{\nclass Program\n{\nstatic public int Add(int a, int b)\n{\n//write your function here...\n}\nstatic void Main(string[] args)\n{\nint x,y,result=0;\nx = Convert.ToInt32(Console.ReadLine());\ny = Convert.ToInt32(Console.ReadLine());\nresult= Add(x,y);\nConsole.WriteLine(result);\n}\n}\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\" name=\"evalPro\" language=\"python\"><editor>def add(a, b):\n#write your function here...\nnum1 = input()\nnum2 = input()\nsum = add(int(num1),int(num2))\nprint(sum)</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"perl\"><editor>sub add\n{\n($n1,$n2) = @_;\n#Write your code here..\n}\n$n1 = <STDIN> ;\n$n2 = <STDIN> ;\n$res = add($n1 , $n2);\nprint \"$res\";</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"node.js\"><editor>\nfunction add(a, b) {\n//write your function here...\n}\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding(\"ascii\");\nvar _input = \"\",input1 = \"\",input2 = \"\";\nprocess.stdin.on(\"data\", function (input) {\n_input = input.split(/\\n/);\ninput1 = parseInt(_input[0]);\ninput2 = parseInt(_input[1]);\n});\nprocess.stdin.on(\"end\", function () {\nlet result = add(input1,input2);\nconsole.log(result);\n});</editor><testcases><case>2,8|10</case><case>40,60|100</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"sql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"psql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"mssql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"javascript\"><editor>\n// Write your code here \n</editor><testcases><case>Input1,Input2</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"language_name\"><editor>\n//Write your code here...</editor><testcases><case>Input1,Input2|Answer</case><case>Input1,Input2|Answer</case></testcases></SMXML>",
		"sample": "<SMXML type=\"24\"  name=\"evalPro\" language=\"php\"><editor><?php\nfunction Add($a,$b)\n{\n//write your function here...\n}\n$handle = fopen (\"php://stdin\",\"r\");\n$_a = fgets($handle);\n$_b = fgets($handle);\n$result = Add((int)$_a,(int)$_b);\nprint ($result);\nfclose($handle);\n?></editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"Evalpro\" language=\"java\"><editor>\nimport java.io.*;\nimport java.util.*;\nimport java.text.*;\nimport java.math.*;\nimport java.util.regex.*;\nclass Solution {\nstatic int Add(int a, int b)\n{\n//write your function here...\n}\npublic static void main(String[] args) {\nScanner in = new Scanner(System.in);\nint _a;\n_a = in.nextInt();\nint _b;\n_b = in.nextInt();\nint sum;\nsum = Add(_a, _b);\nSystem.out.println(sum);\n}\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c\"><editor>#include <stdio.h>\nint add(int a,int b)\n{\n//write your function here...\n}\nint main()\n{\nint n1,n2,sum;\nscanf(\"%d %d\",&n1,&n2);\nsum = add(n1, n2);\nprintf(\"%d\",sum);\nreturn 0;\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c++\"><editor>#include <iostream>\nusing namespace std;\nint add(int a,int b)\n{\n//write your function here...\n}\nint main()\n{\nint a,b,c;\ncin >> a;\ncin >> b;\nc=add(a,b);\ncout << c;\nreturn 0;\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"c#\"><editor>using System;\nnamespace CsharpPrograms\n{\nclass Program\n{\nstatic public int Add(int a, int b)\n{\n//write your function here...\n}\nstatic void Main(string[] args)\n{\nint x,y,result=0;\nx = Convert.ToInt32(Console.ReadLine());\ny = Convert.ToInt32(Console.ReadLine());\nresult= Add(x,y);\nConsole.WriteLine(result);\n}\n}\n}</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\" name=\"evalPro\" language=\"python\"><editor>def add(a, b):\n#write your function here...\nnum1 = input()\nnum2 = input()\nsum = add(int(num1),int(num2))\nprint(sum)</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"perl\"><editor>sub add\n{\n($n1,$n2) = @_;\n#Write your code here..\n}\n$n1 = <STDIN> ;\n$n2 = <STDIN> ;\n$res = add($n1 , $n2);\nprint \"$res\";</editor><testcases><case>10,20|30</case><case>-5,-15|-20</case><case>5,-15|-10</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"node.js\"><editor>\nfunction add(a, b) {\n//write your function here...\n}\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding(\"ascii\");\nvar _input = \"\",input1 = \"\",input2 = \"\";\nprocess.stdin.on(\"data\", function (input) {\n_input = input.split(/\\n/);\ninput1 = parseInt(_input[0]);\ninput2 = parseInt(_input[1]);\n});\nprocess.stdin.on(\"end\", function () {\nlet result = add(input1,input2);\nconsole.log(result);\n});</editor><testcases><case>2,8|10</case><case>40,60|100</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"sql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"psql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"mssql\"><editor>\n-- Write your code here \nselect * from test2;</editor><testcases><case>mark</td> <td align=\"right\">67</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"javascript\"><editor>\n// Write your code here \n</editor><testcases><case>Input1,Input2</case></testcases></SMXML><SMXML type=\"24\"  name=\"evalPro\" language=\"language_name\"><editor>\n//Write your code here...</editor><testcases><case>Input1,Input2|Answer</case><case>Input1,Input2|Answer</case></testcases></SMXML>"
	};

	return xmls[type];
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DefaultXML", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DefaultXML> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ getDefaultXMl });
	return [];
}

class DefaultXML extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DefaultXML",
			options,
			id: create_fragment.name
		});
	}
}

export default DefaultXML;
export { getDefaultXMl };
//# sourceMappingURL=defaultXML-79a84997.js.map
