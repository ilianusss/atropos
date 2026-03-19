app:
	npx expo prebuild --clean
	npx expo export:embed --entry-file='node_modules/expo-router/entry.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'
	open ios/atropos.xcworkspace
