$param=$args[0]
Remove-Item -Recurse -Force 'public\build\editor\*'
if ($param -eq 'dev') {
	npm run dev
} elseif ($param -eq 'build') {
	npm run build
}