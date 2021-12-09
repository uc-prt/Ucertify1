$param=$args[0]
if ($param -eq 'dev') {
	Remove-Item -Recurse -Force 'public\build\editor\*'
	npm run dev
} elseif ($param -eq 'build') {
	Remove-Item -Recurse -Force 'public\build\editor\*'
	npm run build
} elseif ($param -eq 'item_build') {
	$numbers=1,4,5,6,7,9,14,20,22,26,27,30,35,37,38,41,43,44,56,57
	foreach ($num in $numbers) {
		$build = "build_q"+ $num
		npm run $build
	}
}
echo "Done!!"