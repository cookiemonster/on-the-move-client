import { TabsPage } from './tabs/tabs.page';
import { TutorialPage } from './tutorial/tutorial.page';
import { StartPage } from './start/start.page';

// The page the user lands on after opening the app and without a session
//export const FirstRunPage = StartPage;
export const FirstRunPage = TutorialPage;
export const LoadPage = StartPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;
