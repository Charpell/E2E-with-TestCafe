import minimist from 'minimist';
import { ClientFunction, Selector } from 'prodperfect-testcafe';
import { v4 } from 'uuid';
import fs from 'fs';


const args = minimist(process.argv.slice(2));
const origin = args.origin || "https://staging.buildout.com/";

const getLocation = ClientFunction(() => document.location.href);
const goBack = ClientFunction(() => window.history.back());

const getProdPerfectTracking = ClientFunction(() => window.ProdPerfectKeen);
const script_loader_function = new Function(fs.readFileSync('./data-recorder/buildout-tracking-snippet.js').toString());

const setProdPerfectTracking = async (t) => {
  const isTrackingInstalled = await getProdPerfectTracking();
  if (!isTrackingInstalled) {
    await t.eval(script_loader_function);
  }
};

const logTestRunId = ( t ) => { console.log(t.testRun.id) };

let testSuiteRunId = undefined;
const setProdPerfectCookie = ClientFunction( ( id, name, testSuiteRunId, env ) => {
    const data = {
        test_run_data: {
            cli_command: env.npm_lifecycle_script,
            test_script_run_id: id,
            test_suite_run_id: testSuiteRunId,
            test_script: name,
            test_suite: env.npm_package_name,
            version: env.npm_package_version
        }
    };
    const jsonData = JSON.stringify(data);
    document.cookie = `prodperfect_test=${jsonData}; path=/`;
    location.reload();
});

fixture `buildout (${origin})`
    .page `${origin}`
    .before( async ctx => {
        testSuiteRunId = v4();
    })
    .beforeEach( async t => {
        await t.resizeWindow(1020, 700);
        const testRun = t.testRun;
        await setProdPerfectCookie(testRun.id, testRun.test.name, testSuiteRunId, process.env);
    })
    .afterEach( async t => {
        // output the testRun id to match up with automated screenshots (if turned on)
        if (t.testRun.opts.recordScreenCapture) {
            logTestRunId(t);
        }
    });
const getDateToday = () => {
    let today = new Date();
    let dd = today.getDate(); // One day in the future
    let mm = today.getMonth()+1; //January is 0!
    const yyyy = today.getFullYear()+1;

    if (dd < 10) {
        dd = `0${dd}`;
    }

    if (mm < 10) {
        mm = `0${mm}`
    }

    return `${yyyy}-${mm}-${dd}`;
};
const login = async (t) => {
    // Login steps
    await t
       .click(Selector('input').withAttribute('id','login'))
       .typeText(Selector('input').withAttribute('id','login'),'buildout-user@prodperfect.com',{replace:true})  //class : login_field email w-input , element_cursor : text , data-name : login , name : login , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#login , element_tag_name : INPUT , element_type : text , element_value : buildout-user@prodperfect.com
       .click(Selector('input').withAttribute('id','password'))  //class : login_field w-input , element_cursor : text , data-name : password , name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_tag_name : INPUT , element_type : password
       .click(Selector('input').withAttribute('id','password'))
       .typeText(Selector('input').withAttribute('id','password'),'Bu1ld0uT+Pr0dP3rf3cT',{replace:true})  //class : login_field w-input , element_cursor : text , data-name : password , name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_tag_name : INPUT , element_type : password , element_value : Bu1ld0uT+Pr0dP3rf3cT
       .click(Selector('#login_form > input').nth(2))  //class : login_button w-button , element_cursor : pointer , data-wait : Please wait... , element_node_name : INPUT , element_tag_name : INPUT , element_type : submit , element_value : Log In > , value : Log In >
       .expect(getLocation()).match(/staging\.buildout\.com\/properties/);
};



test('2018_12_13_buildout_test_1',async t => {
    // description: Edit demographics, add doc, edit property
  // video: https://drive.google.com/open?id=1Ob14buKXKmlhCVi4f7c9kbKu7r0qTFd_
 
 
    await setProdPerfectTracking(t);
    await t
        .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , text : log in , element_text_content : log in
        .expect(getLocation()).match(/buildout\.com\/login/);
 
    await setProdPerfectTracking(t);
    await login(t)
 
    await setProdPerfectTracking(t);
    const propsName = v4()
    await t
        .click(Selector('input').withAttribute('id','q_filter_or_property_id_cont'))
        .typeText(Selector('input').withAttribute('id','q_filter_or_property_id_cont'), 'NNN Sample Dr',{replace:true})  //class : form-control js-text-search , element_cursor : text , name : q[filter_or_property_id_cont] , element_node_name : INPUT , element_selector : body > form#property_search > div:eq(0) > div > div > div:eq(0) > div > input#q_filter_or_property_id_cont , element_tag_name : INPUT , element_type : search , element_value : avalon
        .wait(3000)
        .click(Selector('#js-result-container > div').nth(0).find('div > div > div').nth(0).find('div > div').nth(0))  //class : row hover-content top-container , element_cursor : pointer , element_node_name : DIV , element_tag_name : DIV , element_text_content :  Edit
        .expect(getLocation()).match(/buildout\.com\/properties/);
 
    await setProdPerfectTracking(t);
    await t
        .click(Selector('a').withAttribute('href',/.*\/properties\/\d+\/edit.*/i).filterVisible().nth(0))  //class : btn btn-dark , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(2) > div > div > div:eq(2) > div:eq(1) > a , element_tag_name : A , text : Edit Property , element_text_content : Edit Property
        .expect(getLocation()).match(/buildout\.com\/properties\/\d+\/edit/);
 
    await setProdPerfectTracking(t);
    const photoCom = v4()
    await t
        .click(Selector('a').withAttribute('href', '#mediaFields').filterVisible().nth(0))  //element_cursor : pointer , element_node_name : A , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(0) > div > ul > li:eq(13) > a , element_tag_name : A , text :  Media , element_text_content :  Media
        .click(Selector('input').withAttribute('name','property[photo_attachments_attributes][0][description]'))
        .typeText(Selector('input').withAttribute('name','property[photo_attachments_attributes][0][description]'), photoCom,{replace:true})  //class : form-control string optional , element_cursor : text , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#mediaFields > div#photoFields > div > div:eq(0) > div > div:eq(1) > div > div > div > div:eq(0) > div > div > input , element_tag_name : INPUT , element_type : text , element_value : this is a photo wow , value : this is a photo wow
        .click(Selector('input').withAttribute('id','property_you_tube_url'))  //class : form-control string url optional , element_cursor : text , name : property[you_tube_url] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#mediaFields > div:eq(1) > div > input#property_you_tube_url , element_tag_name : INPUT , element_type : url
        .click(Selector('input').withAttribute('id','property_you_tube_url'))
        .typeText(Selector('input').withAttribute('id','property_you_tube_url'), photoCom,{replace:true})  //class : form-control string url optional , element_cursor : text , name : property[you_tube_url] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#mediaFields > div:eq(1) > div > input#property_you_tube_url , element_tag_name : INPUT , element_type : url , element_value : www.prodperfect.com
        .click(Selector('textarea').withAttribute('id','property_notes').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_notes').filterVisible().nth(0), photoCom,{replace:true})  //class : form-control text optional , element_cursor : text , name : property[notes] , element_node_name : TEXTAREA , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div:eq(17) > div > textarea#property_notes , element_tag_name : TEXTAREA , element_type : textarea , element_value : this is an internal note
        .click(Selector('#brokerFields > div').nth(3))  //class : text-primary clickable js-add-broker bottom-buffer-md collapse , element_cursor : pointer , element_node_name : DIV , element_tag_name : DIV , element_text_content : + Add another broker
        .click(Selector('input').withAttribute('id','outside_broker_0_yes'))  //class : radio js-outside-broker-radio , element_cursor : default , name : broker_outside_select_0 , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#brokerFields > div:eq(1) > div:eq(1) > div > div > input#outside_broker_0_yes , element_tag_name : INPUT , element_type : radio , element_value : true , value : true
        .click(Selector('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field').filterVisible(),'buildout-user+test@prodperfect.com',{replace:true})  //class : select2-search__field , element_cursor : text , element_node_name : INPUT , role : textbox , element_tag_name : INPUT , element_type : search , element_value : buildout-user+test@prodperfect.com
        .wait(3000)
        .pressKey('enter')
        .click(Selector('input').withAttribute('name','commit'))  //class : btn btn-primary , element_cursor : pointer , data-disable-with : Saving ... , element_node_name : INPUT , element_selector : body > div#js-outside-broker-invite > div > div > form#new_outside_broker_invite > div:eq(2) > input , element_tag_name : INPUT , element_type : submit , element_value : Request Broker , value : Request Broker
        .click(Selector('input').withAttribute('id','property_research_property_attributes_county'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_county'),'Cook',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][county] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#locationFields > div:eq(8) > div > input#property_research_property_attributes_county , element_tag_name : INPUT , element_type : text , element_value : Cook , value : Alameda
        .click(Selector('#locationFields > div').nth(7))  //class : row , element_cursor : auto , element_node_name : DIV , element_tag_name : DIV
        .click(Selector('input').withAttribute('id','property_research_property_attributes_market'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_market'),'San Francisco Bay Area And Chicago',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][market] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#locationFields > div:eq(9) > div > input#property_research_property_attributes_market , element_tag_name : INPUT , element_type : text , element_value : San Francisco Bay Area And Chicago , value : San Francisco Bay Area
        .click(Selector('input').withAttribute('id','property_research_property_attributes_submarket'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_submarket'),'South Loop Of Chicago',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][submarket] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#locationFields > div:eq(10) > div > input#property_research_property_attributes_submarket , element_tag_name : INPUT , element_type : text , element_value : South Loop Of Chicago , value : South Loop
        .click(Selector('textarea').withAttribute('id','property_location_description').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_location_description').filterVisible().nth(0),'Fremont is a city in Alameda County, California. Located in the southeast section of the San Francisco Bay Area in the East Bay region primarily, Fremont is now the fourth most populous city in the San Francisco Bay Area, and the largest suburb in the metropolis. Edit Edit',{replace:true})  //aria-required : true , class : form-control text required , element_cursor : text , name : property[location_description] , element_node_name : TEXTAREA , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#locationFields > div:eq(12) > div > textarea#property_location_description , element_tag_name : TEXTAREA , element_text_content : Fremont is a city in Alameda County, California. Located in the southeast section of the San Francisco Bay Area in the East Bay region primarily, Fremont is now the fourth most populous city in the San Francisco Bay Area, and the largest suburb in the metropolis. , element_type : textarea , element_value : Fremont is a city in Alameda County, California. Located in the southeast section of the San Francisco Bay Area in the East Bay region primarily, Fremont is now the fourth most populous city in the San Francisco Bay Area, and the largest suburb in the metropolis. Edit Edit
        .click(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height'),'900',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[research_property_attributes][ceiling_height] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#buildingFields > div:eq(5) > div > input#property_research_property_attributes_ceiling_height , element_tag_name : INPUT , element_type : number , element_value : 900
        .click(Selector('button').withText('Save Property').nth(-1))  //class : btn btn-save right-buffer-md submitLink , element_cursor : not-allowed , element_node_name : BUTTON , element_tag_name : BUTTON , element_text_content : Save Property , element_type : submit
        .expect(getLocation()).match(/buildout\.com\/properties\/\d+\?tab\=docs/);
 
     await t
        .click(Selector('a').withAttribute('href',/.*\/properties\/\d+\/edit.*/i).filterVisible().nth(0))  //class : btn btn-dark , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(2) > div > div > div:eq(2) > div:eq(1) > a , element_tag_name : A , text : Edit Property , element_text_content : Edit Property
        .click(Selector('input').withAttribute('id','property_you_tube_url'))
        .expect(Selector('#property_you_tube_url').value).eql(photoCom)
 
 })
 //
 //
 test('2018_12_13_buildout_test_5',async t => {
    // description: Create new property
  // video: https://drive.google.com/open?id=1byFkK8HcOPqzor_EtqkcpfKYieyy-yI1
 
    await setProdPerfectTracking(t);
    await t
        .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , text : log in , element_text_content : log in
        .expect(getLocation()).match(/buildout\.com\/login/);
 
    await setProdPerfectTracking(t);
    await login(t)
 
    await setProdPerfectTracking(t);
    const name = v4()
    await t
        .click(Selector('a').withAttribute('href',/.*\/properties\/new.*/i).filterVisible().nth(0))  //class : btn btn-create full-width , element_cursor : pointer , element_node_name : A , element_selector : body > form#property_search > div:eq(3) > div > div#advanced-filters-lg > div:eq(0) > a , element_tag_name : A , text : New Property , element_text_content : New Property
        .expect(getLocation()).match(/buildout\.com\/properties\/new/);
    const dateToday = await getDateToday();
    await setProdPerfectTracking(t);
    await t
        .click(Selector('select').withAttribute('id','js-primary-broker-id').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','js-primary-broker-id').filterVisible().nth(0).find('option').withAttribute('value','24013').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[properties_users_attributes][0][user_id] , element_node_name : SELECT , element_options : value:24013, text:ProdPerfect QA , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#brokerFields > div:eq(0) > div > div:eq(2) > div > select#js-primary-broker-id , element_tag_name : SELECT , element_text_content :  ProdPerfect QA , element_type : select-one , element_value : 24013 , option_text : ProdPerfect QA , value : 24013
        .click(Selector('input').withAttribute('id','property_research_property_attributes_address'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_address'),'5535 Westlawn Ave',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][address] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(1) > div > input#property_research_property_attributes_address , element_tag_name : INPUT , element_type : text , element_value : 5535 Westlawn Ave
        .click(Selector('input').withAttribute('id','property_research_property_attributes_address'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_address'),'5535 Westlawn Ave Apt 900',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][address] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(1) > div > input#property_research_property_attributes_address , element_tag_name : INPUT , element_type : text , element_value : 5535 Westlawn Ave Apt 900
        .click(Selector('input').withAttribute('id','property_research_property_attributes_zip'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_zip'),'90066',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][zip] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(2) > div > input#property_research_property_attributes_zip , element_tag_name : INPUT , element_type : text , element_value : 90066
        .click(Selector('input').withAttribute('id','property_research_property_attributes_city'))  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][city] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(3) > div > input#property_research_property_attributes_city , element_tag_name : INPUT , element_type : text
        .click(Selector('input').withAttribute('id','property_research_property_attributes_market'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_market'),'Forest Elves',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][market] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(9) > div > input#property_research_property_attributes_market , element_tag_name : INPUT , element_type : text , element_value : Forest Elves
        .click(Selector('input').withAttribute('id','property_research_property_attributes_submarket'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_submarket'),'Dark Forest Elves',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][submarket] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(10) > div > input#property_research_property_attributes_submarket , element_tag_name : INPUT , element_type : text , element_value : Dark Forest Elves
        .click(Selector('input').withAttribute('id','property_research_property_attributes_cross_streets'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_cross_streets'),'Westlawn & Beatrice',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][cross_streets] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(11) > div > input#property_research_property_attributes_cross_streets , element_tag_name : INPUT , element_type : text , element_value : Westlawn & Beatrice
        .click(Selector('textarea').withAttribute('id','property_location_description').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_location_description').filterVisible().nth(0),'A perfect place to lay in wait for unwary travelers.  Near facebook and yahoo campuses.  Mages need not apply.',{replace:true})  //aria-required : true , class : form-control text required , element_cursor : text , name : property[location_description] , element_node_name : TEXTAREA , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(12) > div > textarea#property_location_description , element_tag_name : TEXTAREA , element_type : textarea , element_value : A perfect place to lay in wait for unwary travelers.  Near facebook and yahoo campuses.  Mages need not apply.
        .click(Selector('.js-show-additional-label').withText('Show Additional Fields'))  //class : js-show-additional-label , element_cursor : pointer , element_node_name : DIV , element_tag_name : DIV , element_text_content : Hide Additional Fields
        .click(Selector('input').withAttribute('id','property_range'))
        .typeText(Selector('input').withAttribute('id','property_range'),'1d6',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[range] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(13) > div:eq(1) > div:eq(1) > div > input#property_range , element_tag_name : INPUT , element_type : text , element_value : 1d6
        .click(Selector('select').withAttribute('id','property_side_of_street').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_side_of_street').filterVisible().nth(0).find('option').withAttribute('value','North').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[side_of_street] , element_node_name : SELECT , element_options : value:North, text:North , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(13) > div:eq(1) > div:eq(3) > div > select#property_side_of_street , element_tag_name : SELECT , element_text_content :  North South East West Northeast Southeast Northwest Southwest , element_type : select-one , element_value : North , option_text : North , value : North
        .click(Selector('select').withAttribute('id','property_street_parking').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_street_parking').filterVisible().nth(0).find('option').withAttribute('value','yes').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[street_parking] , element_node_name : SELECT , element_options : value:yes, text:Yes , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(13) > div:eq(1) > div:eq(4) > div > select#property_street_parking , element_tag_name : SELECT , element_text_content :  Yes No N/A , element_type : select-one , element_value : yes , option_text : Yes , value : yes
        .click(Selector('select').withAttribute('id','property_signal_intersection').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_signal_intersection').filterVisible().nth(0).find('option').withText('').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[signal_intersection] , element_node_name : SELECT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(13) > div:eq(1) > div:eq(5) > div > select#property_signal_intersection , element_tag_name : SELECT , element_text_content :  Yes No N/A , element_type : select-one
        .click(Selector('select').withAttribute('id','property_road_type').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_road_type').filterVisible().nth(0).find('option').withAttribute('value','Paved').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[road_type] , element_node_name : SELECT , element_options : value:Paved, text:Paved , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#locationFields > div:eq(13) > div:eq(1) > div:eq(6) > div > select#property_road_type , element_tag_name : SELECT , element_text_content :  Paved Gravel 2-Track Private Highway Highway Interchange Highway Service Drive Outlot Cul-de-sac Other , element_type : select-one , element_value : Paved , option_text : Paved , value : Paved
        .click(Selector('select').withAttribute('id','primary_property_type_id').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','primary_property_type_id').filterVisible().nth(0).find('option').withAttribute('value','6').filterVisible())  //class : form-control select required js-property-type-id , element_cursor : pointer , data-type-map : [{"id":1,"name":"Office","children":[["Office Building",101],["Creative/Loft",102],["Executive Suites",103],["Medical",104],["Institutional/Governmental",105],["Office Warehouse",106]]},{"id":2,"name":"Retail","children":[["Street Retail",201],["Strip Center",202],["Free Standing Building",203],["Regional Mall",204],["Retail Pad",205],["Vehicle Related",206],["Outlet Center",207],["Power Center",208],["Neighborhood Center",209],["Community Center",210],["Specialty Center",211],["Theme/Festival Center",212],["Restaurant",213],["Post Office",214]]},{"id":3,"name":"Industrial","children":[["Manufacturing",301],["Warehouse/Distribution",302],["Flex Space",303],["Research \u0026 Development",304],["Refrigerated/Cold Storage",305],["Office Showroom",306],["Truck Terminal/Hub/Transit",307],["Self Storage",308]]},{"id":5,"name":"Land","children":[["Office",501],["Retail",502],["Retail-Pad",503],["Industrial",504],["Residential",505],["Multifamily",506],["Other",507]]},{"id":6,"name":"Multifamily","children":[["High-Rise",601],["Mid-Rise",602],["Low-Rise/Garden",603],["Government Subsidized",604],["Mobile Home Park",605],["Senior Living",606],["Skilled Nursing",607]]},{"id":7,"name":"Special Purpose","children":[["School",701],["Marina",702],["Other",703],["Golf Course",704],["Church",705]]},{"id":8,"name":"Hospitality","children":[["Full Service",801],["Limited Service",802],["Select Service",803],["Resort",804],["Economy",805],["Extended Stay",806],["Casino",807]]}] , name : property[research_property_attributes][property_type_mappings_attributes][0][property_type_id] , element_node_name : SELECT , element_options : value:6, text:Multifamily , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#propertyFields > div:eq(0) > div:eq(0) > div:eq(1) > div > select#primary_property_type_id , element_tag_name : SELECT , element_text_content : Office Retail Industrial Land Multifamily Special Purpose Hospitality , element_type : select-one , element_value : 6 , option_text : Multifamily , value : 6
        .click(Selector('select').withAttribute('id','primary_property_subtype_id').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','primary_property_subtype_id').filterVisible().nth(0).find('option').withAttribute('value','603').filterVisible())  //class : form-control select required js-property-subtype-id , element_cursor : pointer , name : property[research_property_attributes][property_type_mappings_attributes][0][property_subtype_id] , element_node_name : SELECT , element_options : value:603, text:Low-Rise/Garden , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#propertyFields > div:eq(0) > div:eq(1) > div > div > select#primary_property_subtype_id , element_tag_name : SELECT , element_text_content : High-RiseMid-RiseLow-Rise/GardenGovernment SubsidizedMobile Home ParkSenior LivingSkilled Nursing , element_type : select-one , element_value : 603 , option_text : Low-Rise/Garden , value : 603
        .click(Selector('input').withAttribute('id','property_research_property_attributes_name'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_name'), name, {replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][name] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#propertyFields > div:eq(4) > div:eq(0) > div > div > input#property_research_property_attributes_name , element_tag_name : INPUT , element_type : text , element_value : Avalon Funkhouser
        .click(Selector('input').withAttribute('id','property_research_property_attributes_zoning'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_zoning'),'yes',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[research_property_attributes][zoning] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#propertyFields > div:eq(6) > div > input#property_research_property_attributes_zoning , element_tag_name : INPUT , element_type : text , element_value : yes
        .click(Selector('input').withAttribute('id','property_research_property_attributes_building_size'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_building_size'),'1000000000',{replace:true})  //aria-required : true , class : form-control numeric float required , element_cursor : text , name : property[research_property_attributes][building_size] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(0) > div > input#property_research_property_attributes_building_size , element_tag_name : INPUT , element_type : number , element_value : 1000000000
        .click(Selector('input').withAttribute('id','property_research_property_attributes_occupancy_pct'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_occupancy_pct'),'5',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[research_property_attributes][occupancy_pct] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(2) > div > input#property_research_property_attributes_occupancy_pct , element_tag_name : INPUT , element_type : number , element_value : 5
        .click(Selector('select').withAttribute('id','property_research_property_attributes_tenancy_id').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_research_property_attributes_tenancy_id').filterVisible().nth(0).find('option').withAttribute('value','2').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[research_property_attributes][tenancy_id] , element_node_name : SELECT , element_options : value:2, text:Multiple , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(3) > div > select#property_research_property_attributes_tenancy_id , element_tag_name : SELECT , element_text_content :  Single Multiple , element_type : select-one , element_value : 2 , option_text : Multiple , value : 2
        .click(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height'),'300',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[research_property_attributes][ceiling_height] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(5) > div > input#property_research_property_attributes_ceiling_height , element_tag_name : INPUT , element_type : number , element_value : 300
        .click(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height_min'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_ceiling_height_min'),'2',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[research_property_attributes][ceiling_height_min] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(6) > div > input#property_research_property_attributes_ceiling_height_min , element_tag_name : INPUT , element_type : number , element_value : 2
        .click(Selector('input').withAttribute('id','property_research_property_attributes_stories'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_stories'),'10',{replace:true})  //class : form-control numeric integer optional , element_cursor : text , name : property[research_property_attributes][stories] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(8) > div > input#property_research_property_attributes_stories , element_tag_name : INPUT , element_type : number , element_value : 10
        .click(Selector('input').withAttribute('id','property_research_property_attributes_typical_floor_size'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_typical_floor_size'),'50000',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[research_property_attributes][typical_floor_size] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(9) > div > input#property_research_property_attributes_typical_floor_size , element_tag_name : INPUT , element_type : number , element_value : 50000
        .click(Selector('input').withAttribute('id','property_research_property_attributes_year_built'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_year_built'),'1776',{replace:true})  //class : form-control numeric integer optional , element_cursor : text , name : property[research_property_attributes][year_built] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(10) > div > input#property_research_property_attributes_year_built , element_tag_name : INPUT , element_type : number , element_value : 1776
        .click(Selector('input').withAttribute('id','property_research_property_attributes_renovated'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_renovated'),'2019',{replace:true})  //class : form-control numeric integer optional , element_cursor : text , name : property[research_property_attributes][renovated] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#buildingFields > div:eq(11) > div > input#property_research_property_attributes_renovated , element_tag_name : INPUT , element_type : number , element_value : 2019
        .click(Selector('input').withAttribute('id','property_research_property_attributes_number_of_units'))
        .typeText(Selector('input').withAttribute('id','property_research_property_attributes_number_of_units'),'9000',{replace:true})  //class : form-control numeric integer optional , element_cursor : text , name : property[research_property_attributes][number_of_units] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#unitFields > div:eq(0) > div > input#property_research_property_attributes_number_of_units , element_tag_name : INPUT , element_type : number , element_value : 9000
        .click(Selector('input').withAttribute('id','property_include_unit_mix'))  //class : boolean optional , element_cursor : pointer , name : property[include_unit_mix] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#unitFields > div#unitMixRow > div:eq(0) > div > label > input#property_include_unit_mix , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
        .click(Selector('input').withAttribute('id','property_include_unit_mix'))  //class : boolean optional , element_cursor : pointer , name : property[include_unit_mix] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#unitFields > div#unitMixRow > div:eq(0) > div > label > input#property_include_unit_mix , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
        .click(Selector('input').withAttribute('id','property_sale_checked'))  //class : boolean optional , element_cursor : pointer , name : property[sale_checked] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#availabilityFields > div:eq(0) > div:eq(1) > div > div > label > input#property_sale_checked , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
        .click(Selector('input').withAttribute('id','property_sale_listed_on'))  //class : form-control string optional dateSelectInput hasDatepicker , element_cursor : text , name : property[sale_listed_on] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#availabilityFields > div:eq(3) > div > input#property_sale_listed_on , element_tag_name : INPUT , element_type : text
        .typeText(Selector('input').withAttribute('id','property_sale_expiration'), dateToday, {replace: true})  //class : form-control string optional dateSelectInput hasDatepicker , element_cursor : text , name : property[sale_expiration] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#availabilityFields > div:eq(4) > div > input#property_sale_expiration , element_tag_name : INPUT , element_type : text
        .click(Selector('input').withAttribute('id','property_sale_listing_attributes_title'))  //class : form-control string optional , element_cursor : text , name : property[sale_listing_attributes][title] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(2) > div > input#property_sale_listing_attributes_title , element_tag_name : INPUT , element_type : text
        .typeText(Selector('input').withAttribute('id','property_sale_listing_attributes_title'),'Elves Wants To Live Here',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[sale_listing_attributes][title] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(2) > div > input#property_sale_listing_attributes_title , element_tag_name : INPUT , element_type : text , element_value : Elves' Want To Live Here
        .click(Selector('textarea').withAttribute('id','property_sale_listing_attributes_description').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_sale_listing_attributes_description').filterVisible().nth(0),'This is an amazing chance. This property defies the laws of physics to bring you gigantic properties within a small los angeles city block. ',{replace:true})  //aria-required : true , class : form-control text required , element_cursor : text , name : property[sale_listing_attributes][description] , element_node_name : TEXTAREA , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(3) > div > textarea#property_sale_listing_attributes_description , element_tag_name : TEXTAREA , element_type : textarea , element_value : This is an amazing chance. This property defies the laws of physics to bring you gigantic properties within a small los angeles city block.
        .click(Selector('textarea').withAttribute('id','property_sale_listing_attributes_bullets').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_sale_listing_attributes_bullets').filterVisible().nth(0),'Sale bullets. Pew Pew. ',{replace:true})  //class : form-control text optional , element_cursor : text , name : property[sale_listing_attributes][bullets] , element_node_name : TEXTAREA , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(4) > div > textarea#property_sale_listing_attributes_bullets , element_tag_name : TEXTAREA , element_type : textarea , element_value : Sale bullets. Pew Pew.
        .click(Selector('select').withAttribute('id','property_research_property_attributes_property_use_id').filterVisible().nth(0))
        .click(Selector('select').withAttribute('id','property_research_property_attributes_property_use_id').filterVisible().nth(0).find('option').withAttribute('value','3').filterVisible())  //class : form-control select optional , element_cursor : pointer , name : property[research_property_attributes][property_use_id] , element_node_name : SELECT , element_options : value:3, text:Owner / User , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(5) > div > select#property_research_property_attributes_property_use_id , element_tag_name : SELECT , element_text_content :  Net Leased Investment Investment Owner / User Business for Sale Development , element_type : select-one , element_value : 3 , option_text : Owner / User , value : 3
        .click(Selector('input').withAttribute('id','property_commission_pct'))
        .typeText(Selector('input').withAttribute('id','property_commission_pct'),'10',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[commission_pct] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#saleFields > div:eq(8) > div > input#property_commission_pct , element_tag_name : INPUT , element_type : number , element_value : 10
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_name'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_name'),'This is a name',{replace:true})  //class : form-control string optional statementName , element_cursor : text , name : property[financial_statements_attributes][0][name] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(3) > div > input#property_financial_statements_attributes_0_name , element_tag_name : INPUT , element_type : text , element_value : This is a name
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_sale_price'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_sale_price'),'9000000',{replace:true})  //class : form-control numeric float optional salePrice , element_cursor : text , name : property[financial_statements_attributes][0][sale_price] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(4) > div:eq(0) > div > div > input#property_financial_statements_attributes_0_sale_price , element_tag_name : INPUT , element_type : number , element_value : -9000000
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_net_operating_income_override'))  //class : numeric float optional autoFormat form-control , element_cursor : text , data-format : float , name : property[financial_statements_attributes][0][net_operating_income_override] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(17) > div > div > div:eq(0) > div > div > input#property_financial_statements_attributes_0_net_operating_income_override , element_tag_name : INPUT , element_type : number
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_net_operating_income_override'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_net_operating_income_override'),'234567.00',{replace:true})  //class : numeric float optional autoFormat form-control , element_cursor : text , data-format : float , name : property[financial_statements_attributes][0][net_operating_income_override] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(17) > div > div > div:eq(0) > div > div > input#property_financial_statements_attributes_0_net_operating_income_override , element_tag_name : INPUT , element_type : number , element_value : 234567.00
        .click(Selector('input').withAttribute('id','property_you_tube_url'))
        .typeText(Selector('input').withAttribute('id','property_you_tube_url'),'www.prodperfect.com/video',{replace:true})  //class : form-control string url optional , element_cursor : text , name : property[you_tube_url] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#mediaFields > div:eq(1) > div > input#property_you_tube_url , element_tag_name : INPUT , element_type : url , element_value : www.prodperfect.com/video
        .click(Selector('input').withAttribute('id','property_realvision_url'))
        .typeText(Selector('input').withAttribute('id','property_realvision_url'),'www.prodperfect.com',{replace:true})  //class : form-control string url optional , element_cursor : text , name : property[realvision_url] , element_node_name : INPUT , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div#mediaFields > div:eq(3) > div > input#property_realvision_url , element_tag_name : INPUT , element_type : url , element_value : www.prodperfect.com
        .click(Selector('textarea').withAttribute('id','property_notes').filterVisible().nth(0))
        .typeText(Selector('textarea').withAttribute('id','property_notes').filterVisible().nth(0),'This is a great note. Wow. ',{replace:true})  //class : form-control text optional , element_cursor : text , name : property[notes] , element_node_name : TEXTAREA , element_selector : body > form#new_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(1) > div:eq(17) > div > textarea#property_notes , element_tag_name : TEXTAREA , element_type : textarea , element_value : This is a great note. Wow.
        .click(Selector('button').withText('Save Property'))
        .expect(getLocation()).match(/\.com\/properties\/\d+\?tab\=docs\&folder\_id\=\d+\&recycle\_bin\=false/);
 
        await t
        .navigateTo(`${origin}/properties`)
        .expect(Selector('.title').textContent).eql(name)
 
 })
 test('2018_12_13_buildout_test_6',async t => {
    // description: Filter search, upload doc, change title, edit financials, add photo, add website
  // video: https://drive.google.com/open?id=15q7cX4mJ6T9Tlm_zGtTLe-cNSbsGk8ZP
 
 
    await setProdPerfectTracking(t);
    await t
        .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , text : log in , element_text_content : log in
        .expect(getLocation()).match(/.buildout\.com\/login/);
 
    await setProdPerfectTracking(t);
    await login(t)
 
    await setProdPerfectTracking(t);
    await t
        .click(Selector('label').withAttribute('for','q_proposal_true').filterVisible().nth(0))  //class : unstyled clickable , element_cursor : pointer , element_node_name : LABEL , element_selector : body > form#property_search > div:eq(3) > div > div#advanced-filters-lg > div#js-available-filters > div > div:eq(1) > label , element_tag_name : LABEL , element_text_content : Proposal
        .click(Selector('#js-result-container > div').nth(0).find('div').nth(0).find('div > div').nth(0).find('div > div').nth(0))  //class : row hover-content top-container , element_cursor : pointer , element_node_name : DIV , element_tag_name : DIV , element_text_content :  Edit
        .expect(getLocation()).match(/buildout\.com\/properties\/\d+\?tab\=docs/);

 
    await setProdPerfectTracking(t);
    const filName = v4().replace(/-/g, '');
    const fileDoc = await Selector('.js-doc-row')
    const fileDocCount = await fileDoc.count;
    await t
        .click(Selector('.js-upload-button'))  //element_cursor : pointer , element_node_name : path , element_tag_name : path
        .setFilesToUpload('input[type="file"]', './test-docs/pptest2.pdf')
        .click(Selector('.js-context-menu-button').nth(0))  //element_cursor : auto , element_node_name : SPAN , element_tag_name : SPAN
        .click(Selector('li.context-menu-item > span').withText('Rename'), {replace: true})  //class : bootbox-input bootbox-input-text form-control , element_cursor : text , element_node_name : INPUT , element_tag_name : INPUT , element_type : text , element_value : Buildout.pdf
        .typeText(Selector('input.bootbox-input-text'), filName)  //class : bootbox-input bootbox-input-text form-control , element_cursor : text , element_node_name : INPUT , element_tag_name : INPUT , element_type : text , element_value : Buildout.pdf
        .click(Selector('button').withText('OK'))
        .expect( Selector('.js-doc-row').count).eql(fileDocCount + 1)
        await t
        .click(Selector('a').withAttribute('href',/.*\/properties\/\d+\/edit.*/i).filterVisible().nth(0))  //class : btn btn-dark , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(2) > div > div > div:eq(2) > div:eq(1) > a , element_tag_name : A , text : Edit Property , element_text_content : Edit Property
        .expect(getLocation()).match(/buildout\.com\/properties\/\d+\/edit/);
 
    await setProdPerfectTracking(t);
    if (await Selector('a').withText('show advanced financials').exists) {
        await t.click(Selector('a').withText('show advanced financials'))
    }
    await t
        .click(Selector('a.js-financials'))
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_name'))  //class : form-control string optional statementName , element_cursor : text , name : property[financial_statements_attributes][0][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(3) > div > input#property_financial_statements_attributes_0_name , element_tag_name : INPUT , element_type : text , element_value : This is a name , value : This is a name
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_name'),'This is a name and this is advanced',{replace:true})  //class : form-control string optional statementName , element_cursor : text , name : property[financial_statements_attributes][0][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(3) > div > input#property_financial_statements_attributes_0_name , element_tag_name : INPUT , element_type : text , element_value : This is a name and this is advanced , value : This is a name
       //  .click(Selector('label').withAttribute('for','property_financial_statements_attributes_0_include_income_breakdown').filterVisible())  //class : boolean optional , element_cursor : pointer , element_node_name : LABEL , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(6) > div:eq(4) > div > label , element_tag_name : LABEL , element_text_content : Include Income Breakdown
   await setProdPerfectTracking(t);
   if (await Selector('.attribute-row.incomes.hide').exists) {
       await t.click(Selector('label').withAttribute('for','property_financial_statements_attributes_0_include_income_breakdown').filterVisible())
   }

   await t
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_1_name'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_1_name'),'a type',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][1][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(1) > td:eq(0) > div:eq(3) > div > input#property_financial_statements_attributes_0_incomes_attributes_1_name , element_tag_name : INPUT , element_type : text , element_value : a type
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_1_amount'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_1_amount'),'4000.00',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][1][amount] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(1) > td:eq(1) > div > div > input#property_financial_statements_attributes_0_incomes_attributes_1_amount , element_tag_name : INPUT , element_type : number , element_value : 4000.00
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_2_name'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_2_name'),'b type',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][2][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(2) > td:eq(0) > div:eq(3) > div > input#property_financial_statements_attributes_0_incomes_attributes_2_name , element_tag_name : INPUT , element_type : text , element_value : b type
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_2_amount'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_2_amount'),'8000.00',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][2][amount] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(2) > td:eq(1) > div > div > input#property_financial_statements_attributes_0_incomes_attributes_2_amount , element_tag_name : INPUT , element_type : number , element_value : 8000.00
        .click(Selector('A').withText('+ add a row').filterVisible())  //class : clickable addRow right-buffer-md , element_cursor : pointer , element_node_name : A , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tfoot > tr:eq(1) > td > small > a:eq(0) , element_tag_name : A , element_text_content : + add a row
        .wait(1000)
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_name').filterVisible())
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_name').filterVisible(),'c type',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][3][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(3) > td:eq(0) > div:eq(3) > div > input#property_financial_statements_attributes_0_incomes_attributes_0_name , element_tag_name : INPUT , element_type : text , element_value : c type
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_amount').filterVisible())
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_amount').filterVisible(),'1234567.00',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][3][amount] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(3) > td:eq(1) > div > div > input#property_financial_statements_attributes_0_incomes_attributes_0_amount , element_tag_name : INPUT , element_type : number , element_value : 1234567.00
        .click(Selector('A').withText('+ add a row').filterVisible())  //class : clickable addRow right-buffer-md , element_cursor : pointer , element_node_name : A , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tfoot > tr:eq(1) > td > small > a:eq(0) , element_tag_name : A , element_text_content : + add a row
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_name').filterVisible().nth(1))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_name').filterVisible().nth(1),'d type',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][4][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(4) > td:eq(0) > div:eq(3) > div > input#property_financial_statements_attributes_0_incomes_attributes_0_name , element_tag_name : INPUT , element_type : text , element_value : d type
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_amount').filterVisible().nth(1))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_incomes_attributes_0_amount').filterVisible().nth(1),'1234.00',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[financial_statements_attributes][0][incomes_attributes][4][amount] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(7) > div > table > tbody > tr:eq(4) > td:eq(1) > div > div > input#property_financial_statements_attributes_0_incomes_attributes_0_amount , element_tag_name : INPUT , element_type : number , element_value : -1234.00
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_gross_scheduled_income').filterVisible())
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_gross_scheduled_income').filterVisible(),'488828.00',{replace:true})  //class : numeric float optional form-control autoFormat , element_cursor : text , data-format : float , name : property[financial_statements_attributes][0][gross_scheduled_income] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(8) > div > div:eq(0) > div > div > input#property_financial_statements_attributes_0_gross_scheduled_income , element_tag_name : INPUT , element_type : number , element_value : 488828.00
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_other_income').filterVisible())
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_other_income').filterVisible(),'19992847381274.00',{replace:true})  //class : numeric float optional form-control autoFormat , element_cursor : text , data-format : float , name : property[financial_statements_attributes][0][other_income] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(9) > div > div:eq(0) > div > div > input#property_financial_statements_attributes_0_other_income , element_tag_name : INPUT , element_type : number , element_value : 19992847381274.00
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_vacancy_percent').filterVisible())
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_vacancy_percent').filterVisible(),'30.00',{replace:true})  //class : numeric float optional autoFormat form-control , element_cursor : text , data-format : float , name : property[financial_statements_attributes][0][vacancy_percent] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(11) > div > div > div > div > input#property_financial_statements_attributes_0_vacancy_percent , element_tag_name : INPUT , element_type : number , element_value : 30.00
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_include_expense_breakdown'))  //class : boolean optional includeExpenseBreakdown , element_cursor : pointer , name : property[financial_statements_attributes][0][include_expense_breakdown] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(14) > div:eq(1) > div > label > input#property_financial_statements_attributes_0_include_expense_breakdown , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_expenses_attributes_1_name'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_expenses_attributes_1_name'),'an expense',{replace:true})  //class : form-control string optional , element_cursor : text , name : property[financial_statements_attributes][0][expenses_attributes][1][name] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(14) > div:eq(2) > div > table > tbody > tr:eq(1) > td:eq(0) > div:eq(3) > input#property_financial_statements_attributes_0_expenses_attributes_1_name , element_tag_name : INPUT , element_type : text , element_value : an expense
        .click(Selector('input').withAttribute('id','property_financial_statements_attributes_0_expenses_attributes_1_amount'))
        .typeText(Selector('input').withAttribute('id','property_financial_statements_attributes_0_expenses_attributes_1_amount'),'-2345.00',{replace:true})  //class : form-control numeric float optional , element_cursor : text , name : property[financial_statements_attributes][0][expenses_attributes][1][amount] , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#financialFields > div > div#financialStatementList > div > div:eq(1) > div:eq(14) > div:eq(2) > div > table > tbody > tr:eq(1) > td:eq(1) > div > input#property_financial_statements_attributes_0_expenses_attributes_1_amount , element_tag_name : INPUT , element_type : number , element_value : -2345.00
        .click(Selector('#financialStatementList > div > div').nth(1))  //class : panel-body propertyFormFieldSetHeader js-financial-body , element_cursor : auto , element_node_name : DIV , element_tag_name : DIV
        .click(Selector('#photoFields > div > div > div > div > div > h4 > svg'))  //aria-hidden : true , element_cursor : pointer , data-icon : image , data-prefix : far , element_node_name : svg , role : img , element_tag_name : svg
        .setFilesToUpload('input[type="file"]', './test-docs/pptest2.pdf')
        .click(Selector('input').withAttribute('name','property[photo_attachments_attributes][0][description]'))
        .typeText(Selector('input').withAttribute('name','property[photo_attachments_attributes][0][description]'), filName,{replace:true})  //class : form-control string optional , element_cursor : text , element_node_name : INPUT , element_selector : body > form#edit_property > div:eq(1) > div > div > div:eq(1) > div:eq(2) > div:eq(2) > div#mediaFields > div#photoFields > div > div:eq(0) > div > div:eq(1) > div > div > div > div:eq(0) > div > div > input , element_tag_name : INPUT , element_type : text , element_value : a screenshot of this page wow , value : a screenshot of this page wow
        .click(Selector('button').withText('Save Property'))
        .expect(getLocation()).match(/buildout\.com\/properties\/\d+\?tab\=docs\&folder\_id\=\d+\&recycle\_bin\=false/);

        await t 
            .navigateTo(`${origin}/properties`)
            .click(Selector('a').withAttribute('href',/.*\/properties\/\d+\/edit.*/i).filterVisible().nth(0))  //class : btn btn-dark , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(2) > div > div > div:eq(2) > div:eq(1) > a , element_tag_name : A , text : Edit Property , element_text_content : Edit Property
            .expect(getLocation()).match(/buildout\.com\/properties\/\d+\/edit/)
            .expect(Selector('input[name="property[photo_attachments_attributes][0][description]"]').value).eql(filName);

 })


test('2018_12_13_buildout_test_10',async t => {
   // description: interact with website tab
 // video: https://drive.google.com/open?id=1ybmvknuKJLTHx78sEfhkNZVsd61acjv5


   await setProdPerfectTracking(t);
   await t
       .expect(getLocation()).match(/buildout\.com\//);

   await setProdPerfectTracking(t);
   await t
       .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , text : log in , element_text_content : log in
       .expect(getLocation()).match(/buildout\.com\/login/);

   await setProdPerfectTracking(t);
   await t
       .click(Selector('input').withAttribute('id','login'))
       .typeText(Selector('input').withAttribute('id','login'),'buildout-user@prodperfect.com',{replace:true})  //class : login_field email w-input , element_cursor : text , data-name : login , name : login , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#login , element_tag_name : INPUT , element_type : text , element_value : buildout-user@prodperfect.com
       .click(Selector('input').withAttribute('id','password'))
       .typeText(Selector('input').withAttribute('id','password'),'Bu1ld0uT+Pr0dP3rf3cT',{replace:true})  //class : login_field w-input , element_cursor : text , data-name : password , name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_tag_name : INPUT , element_type : password , element_value : Bu1ld0uT+Pr0dP3rf3cT
       .click(Selector('#login_form > input').nth(2))  //class : login_button w-button , element_cursor : pointer , data-wait : Please wait... , element_node_name : INPUT , element_tag_name : INPUT , element_type : submit , element_value : Log In > , value : Log In >
       .expect(getLocation()).match(/buildout\.com\/properties/);

   await setProdPerfectTracking(t);
   await t
       .click(Selector('input').withAttribute('id','q_filter_or_property_id_cont'))
       .typeText(Selector('input').withAttribute('id','q_filter_or_property_id_cont'),'avalon',{replace:true})  //class : form-control js-text-search , element_cursor : text , name : q[filter_or_property_id_cont] , element_node_name : INPUT , element_selector : body > form#property_search > div:eq(0) > div > div > div:eq(0) > div > input#q_filter_or_property_id_cont , element_tag_name : INPUT , element_type : search , element_value : avalon
       .wait(3000)
       .click(Selector('#js-result-container > div').nth(0).find('div > div > div').nth(0).find('div > div').nth(0))  //class : row hover-content top-container , element_cursor : pointer , element_node_name : DIV , element_tag_name : DIV , element_text_content :  Edit
       .expect(getLocation()).match(/buildout\.com\/properties/);

   await setProdPerfectTracking(t);
   await t
       .click(Selector('a').withAttribute('href', '#website').filterVisible().nth(0))  //aria-expanded : true , element_cursor : default , data-toggle : tab , data-url : /properties/tab?id=347944&tab=website , element_node_name : A , element_selector : body > div:eq(3) > div > ul > li:eq(2) > a , element_tag_name : A , text : Website
       .click(Selector('input').withAttribute('id', /listing_form_\d+_property_plugin_listing_show_demographics_tab/))  //class : boolean optional , element_cursor : pointer , name : property_plugin_listing[show_demographics_tab] , element_node_name : INPUT , element_selector : body > div:eq(4) > div > div > div > div#website > div:eq(1) > div > div > div > form#listing_form_587799_edit_property_plugin_listing_587799 > div:eq(2) > div > div:eq(1) > div:eq(3) > div > label > input#listing_form_587799_property_plugin_listing_show_demographics_tab , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
       .click(Selector('input').withAttribute('id', /listing_form_\d+_property_plugin_listing_show_photo_caption/))  //class : boolean optional , element_cursor : pointer , name : property_plugin_listing[show_photo_caption] , element_node_name : INPUT , element_selector : body > div:eq(4) > div > div > div > div#website > div:eq(1) > div > div > div > form#listing_form_587799_edit_property_plugin_listing_587799 > div:eq(3) > div > div:eq(1) > div > div > label > input#listing_form_587799_property_plugin_listing_show_photo_caption , element_tag_name : INPUT , element_type : checkbox , element_value : 1 , value : 1
       .click(Selector('input').withAttribute('id', /listing_form_\d+_property_plugin_listing_broker_photo_style_square/))  //class : radio_buttons optional , element_cursor : default , name : property_plugin_listing[broker_photo_style] , element_node_name : INPUT , element_selector : body > div:eq(4) > div > div > div > div#website > div:eq(1) > div > div > div > form#listing_form_587799_edit_property_plugin_listing_587799 > div:eq(4) > div > div:eq(1) > div:eq(1) > label:eq(1) > input#listing_form_587799_property_plugin_listing_broker_photo_style_square , element_tag_name : INPUT , element_type : radio , element_value : square , value : square
       .click(Selector('input').withAttribute('id', /listing_form_\d+_property_plugin_listing_banner_text/))
       .typeText(Selector('input').withAttribute('id', /listing_form_\d+_property_plugin_listing_banner_text/),'This is a banner omg',{replace:true})  //class : form-control string optional , element_cursor : text , name : property_plugin_listing[banner_text] , element_node_name : INPUT , element_selector : body > div:eq(4) > div > div > div > div#website > div:eq(1) > div > div > div > form#listing_form_587799_edit_property_plugin_listing_587799 > div:eq(5) > div > div:eq(1) > div > input#listing_form_587799_property_plugin_listing_banner_text , element_tag_name : INPUT , element_type : text , element_value : This is a banner omg
       .click(Selector('#navbar > ul').nth(1).find('li > a > div > div > span').nth(0))  //element_cursor : pointer , element_node_name : SPAN , element_tag_name : SPAN , element_text_content : ProdPerfect QA
       .click(Selector('a').withAttribute('href',/.*\/logout.*/i).filterVisible().nth(0))  //element_cursor : pointer , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(1) > li > ul > li:eq(4) > a , element_tag_name : A , text :  Logout , element_text_content :  Logout
       .expect(getLocation()).match(/buildout\.com\//);

})

// test('2018_12_16_buildout_test_2',async t => {
//     // description: Send and duplicate an e-mail blast
//   // video: https://drive.google.com/open?id=17qsCCTWtlNRXdGrGuaH5cSzqmzSWyNtc

//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //text : log in , element_text_content : log in , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer
//         .expect(getLocation()).match(/buildout\.com\/login/);

//     await setProdPerfectTracking(t);
//     await login(t);

//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('label').withAttribute('for','q_search_on_market').filterVisible().nth(0))  //element_text_content : On Market , element_node_name : LABEL , element_selector : body > form#property_search > div:eq(3) > div > div#advanced-filters-lg > div#js-available-filters > div > div:eq(2) > label , element_tag_name : LABEL , class : unstyled clickable , element_cursor : pointer
//         .click(Selector('label').withAttribute('for','q_not_expired').filterVisible().nth(0))  //element_text_content : On Market , element_node_name : LABEL , element_selector : body > form#property_search > div:eq(3) > div > div#advanced-filters-lg > div#js-available-filters > div > div:eq(2) > label , element_tag_name : LABEL , class : unstyled clickable , element_cursor : pointer
//         .click(Selector('div').withAttribute('data-url', '/properties/347916'))
//         .expect(getLocation()).match(/tab\=docs/);

//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href', '#email').filterVisible().nth(0))  //text : Email , element_node_name : A , element_selector : body > div:eq(3) > div > ul > li:eq(2) > a , element_tag_name : A , element_cursor : default
//         .expect(getLocation()).match(/buildout\.com\/properties\/\d+\?tab\=email/);

//     await setProdPerfectTracking(t);
//     const sentEmails = await Selector('.table > tbody > tr');
//     const emailCount = await sentEmails.count
    
//     await t
//         .click(Selector('#email > div > div').nth(0).find('div').nth(2))  //element_text_content :  Drafts 1 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-drafts-email-link clickable active , element_cursor : pointer
//         .click(Selector('span.js-draft-actions-menu.clickable'))
//         .click(Selector('ul.context-menu-list.context-menu-root > li').nth(0))
//         .click(Selector('#email > div > div').nth(0).find('div').nth(2))  //element_text_content :  Drafts 2 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-drafts-email-link clickable active , element_cursor : pointer
//         .wait(2000)
//         .click(Selector('a.right-buffer-lg').withText('Edit').filterVisible().nth(0))
//         .expect(getLocation()).match(/buildout\.com\/featured\_property\_emails/);

//     await setProdPerfectTracking(t)
//     const dest = Selector('ul.js-connected-lists.ui-sortable').nth(1)
//     await t
//         .dragToElement('li.ui-sortable-handle', dest)
//         .click(Selector('input').withAttribute('value', 'Next Step'))
//         .expect(getLocation()).match(/https\:\/\/staging\.buildout\.com\/email_blasts\/[0-9a-zA-Z_]+\/delivery_details\?redirect_to\=\/properties\/[0-9a-zA-Z_]+\?tab\=email/);


//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','back_end_message_from_name'))
//         .typeText(Selector('input').withAttribute('id','back_end_message_from_name'),'wilson \'the buildout\' funkhouser',{replace:true})  //name : back_end_message[from_name] , element_node_name : INPUT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(0) > input#back_end_message_from_name , element_type : text , element_tag_name : INPUT , class : form-control string required , element_value : wilson 'the buildout' funkhouser , element_cursor : text
//         .click(Selector('select').withAttribute('id','back_end_message_from_email').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_from_email').filterVisible().nth(0).find('option').withAttribute('value','pp-user@prodperfectdev.io').filterVisible())  //name : back_end_message[from_email] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(2) > select#back_end_message_from_email , element_type : select-one , element_tag_name : SELECT , class : form-control select required , element_value : pp-user@prodperfectdev.io , element_cursor : default , element_options : value: pp-user@prodperfectdev.io, text:pp-user@prodperfectdev.io , value :  pp-user@prodperfectdev.io , option_text : pp-user@prodperfectdev.io
//         .click(Selector('select').withAttribute('id','back_end_message_list_id').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_list_id').filterVisible().nth(0).find('option').withAttribute('value','91db019882').filterVisible())  //name : back_end_message[list_id] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(3) > select#back_end_message_list_id , element_type : select-one , element_tag_name : SELECT , class : form-control select required , element_value : 91db019882 , element_cursor : default , element_options : value: 91db019882, text:Buildout Test List , value :  91db019882 , option_text : Buildout Test List
//         .click(Selector('button').withAttribute('name','back_end_message[email_blast_attributes][send_now]').filterVisible().nth(0))  //element_text_content : Send Now , element_node_name : BUTTON , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(2) > div > div > div > div:eq(1) > div:eq(0) > button , element_type : submit , element_tag_name : BUTTON , class : btn btn-success , element_value : true , value : true , element_cursor : pointer
//         .expect(getLocation()).match(/buildout\.com\/properties\/\d+\?tab\=email/)
//         .expect(Selector('.table > tbody > tr').count).eql(emailCount + 1);


//     await setProdPerfectTracking(t);
//     await t
//         // .click(Selector('#email > div > div').nth(1).find('div').nth(0).find('table > tbody > tr > td').nth(0).find('div').nth(1))  //element_node_name : DIV , element_tag_name : DIV , class : email-title , element_cursor : auto
//         .click(Selector('#email > div > div').nth(0).find('div').nth(2))  //element_text_content :  Drafts 1 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-drafts-email-link clickable active , element_cursor : pointer
//         .wait(2000)
//         .click(Selector('span.js-draft-actions-menu.clickable'))
//         .click(Selector('ul.context-menu-list.context-menu-root > li').nth(0))
//         .wait(5000)
//         .click(Selector('#email > div > div').nth(0).find('div').nth(2))  //element_text_content :  Drafts 2 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-drafts-email-link clickable active , element_cursor : pointer
//         .wait(2000)
//         .click(Selector('a.right-buffer-lg').withText('Edit').filterVisible().nth(0))
//         .expect(getLocation()).match(/buildout\.com\/featured\_property\_emails/);

//     await setProdPerfectTracking(t);
//     const title = v4()
//     await t
//         .click(Selector('input').withAttribute('id','featured_property_email_custom_title'))
//         .typeText(Selector('input').withAttribute('id','featured_property_email_custom_title'), title, {replace:true})  //name : featured_property_email[custom_title] , element_node_name : INPUT , element_selector : body > form#featured-property-email-form > div > div:eq(1) > div > div > input#featured_property_email_custom_title , element_type : text , element_tag_name : INPUT , class : form-control string optional , element_value : Dunkin' Donuts NNN Wow , value : Dunkin' Donuts NNN , element_cursor : text
//         .dragToElement('li.ui-sortable-handle', dest)
//         .click(Selector('input').withAttribute('value', 'Next Step'))
//         .expect(getLocation()).match(/email_blasts\/[0-9a-zA-Z_]+\/delivery_details\?redirect_to\=\/properties\/[0-9a-zA-Z_]+\?tab\=email/);

//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','back_end_message_from_name'))
//         .typeText(Selector('input').withAttribute('id','back_end_message_from_name'),'wilson \'the buildout\' funkhouser',{replace:true})  //name : back_end_message[from_name] , element_node_name : INPUT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(0) > input#back_end_message_from_name , element_type : text , element_tag_name : INPUT , class : form-control string required , element_value : wilson 'the buildout' funkhouser , element_cursor : text
//         .click(Selector('select').withAttribute('id','back_end_message_from_email').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_from_email').filterVisible().nth(0).find('option').withAttribute('value','pp-user@prodperfectdev.io').filterVisible())  //name : back_end_message[from_email] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(2) > select#back_end_message_from_email , element_type : select-one , element_tag_name : SELECT , class : form-control select required , element_value : pp-user@prodperfectdev.io , element_cursor : default , element_options : value: pp-user@prodperfectdev.io, text:pp-user@prodperfectdev.io , value :  pp-user@prodperfectdev.io , option_text : pp-user@prodperfectdev.io
//         .click(Selector('select').withAttribute('id','back_end_message_list_id').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_list_id').filterVisible().nth(0).find('option').withAttribute('value','91db019882').filterVisible())  //name : back_end_message[list_id] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div:eq(1) > div > div > div:eq(3) > select#back_end_message_list_id , element_type : select-one , element_tag_name : SELECT , class : form-control select required , element_value : 91db019882 , element_cursor : default , element_options : value: 91db019882, text:Buildout Test List , value :  91db019882 , option_text : Buildout Test List
//         .click(Selector('button').withText('Schedule Delivery'))
//         .click(Selector('input').withAttribute('id','back_end_message_email_blast_attributes_send_on'))  //name : back_end_message[email_blast_attributes][send_on] , element_node_name : INPUT , element_selector : body > div:eq(3) > form#edit_back_end_message > div#schedule-email-modal > div > div > div:eq(1) > div:eq(0) > div:eq(0) > div > input#back_end_message_email_blast_attributes_send_on , element_type : text , element_tag_name : INPUT , class : form-control string required disabled datepicker hasDatepicker , element_cursor : text
//         .click(Selector('a.ui-datepicker-next.ui-corner-all'))
//         .click(Selector('a.ui-state-default').withText('17'))
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_hour').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_hour').filterVisible().nth(0).find('option').withAttribute('value','8').filterVisible())  //name : back_end_message[email_blast_attributes][send_at_hour] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div#schedule-email-modal > div > div > div:eq(1) > div:eq(0) > div:eq(1) > div > div > div:eq(0) > select#back_end_message_email_blast_attributes_send_at_hour , element_type : select-one , element_tag_name : SELECT , class : form-control select optional , element_value : 8 , element_cursor : default , element_options : value: 8, text:8 , value :  8 , option_text : 8
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_minute').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_minute').filterVisible().nth(0).find('option').withAttribute('value','30').filterVisible())  //name : back_end_message[email_blast_attributes][send_at_minute] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div#schedule-email-modal > div > div > div:eq(1) > div:eq(0) > div:eq(1) > div > div > div:eq(1) > select#back_end_message_email_blast_attributes_send_at_minute , element_type : select-one , element_tag_name : SELECT , class : form-control select optional , element_value : 30 , element_cursor : default , element_options : value: 30, text:30 , value :  30 , option_text : 30
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_ampm').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','back_end_message_email_blast_attributes_send_at_ampm').filterVisible().nth(0).find('option').withAttribute('value','pm').filterVisible())  //name : back_end_message[email_blast_attributes][send_at_ampm] , element_node_name : SELECT , element_selector : body > div:eq(3) > form#edit_back_end_message > div#schedule-email-modal > div > div > div:eq(1) > div:eq(0) > div:eq(1) > div > div > div:eq(2) > select#back_end_message_email_blast_attributes_send_at_ampm , element_type : select-one , element_tag_name : SELECT , class : form-control select optional , element_value : pm , element_cursor : default , element_options : value: pm, text:pm , value :  pm , option_text : pm_type : submit , element_tag_name : BUTTON , class : btn btn-primary , element_value : false , value : false , element_cursor : pointer
//         .click(Selector('div.col-xs-12 > button.btn.btn-primary').withText('Schedule Delivery'))
//         .expect(getLocation()).match(/properties\/[0-9a-zA-Z_]+\?tab=email/);

//     await setProdPerfectTracking(t);
//     const scheduled = await Selector('.table > tbody > tr');
//     const scheduledCount = await scheduled.count
//     await t
//         .click(Selector('#email > div > div').nth(0).find('div').nth(1))  //element_text_content :  Scheduled 1 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-scheduled-email-link clickable active , element_cursor : pointer
//         .click(Selector('span.js-email-blast-actions-menu.clickable'));

//     await t
//         .click(Selector('li.context-menu-item > span').withText('Delete').filterVisible())
//         .click(Selector('button.btn.btn-primary').withAttribute('data-bb-handler', 'confirm'))
//         .wait(2000)
//         .click(Selector('#email > div > div').nth(0).find('div').nth(1))  //element_text_content :  Scheduled 1 , element_node_name : DIV , element_tag_name : DIV , class : category-label top-buffer-sm js-scheduled-email-link clickable active , element_cursor : pointer
//         .click(Selector('span.js-email-blast-actions-menu.clickable'))
//         .expect(Selector('.table > tbody > tr').count).eql(scheduledCount - 1);
//     await t
//         .click(Selector('#navbar > ul').nth(1).find('li > a > div > div > span').nth(0))  //element_text_content : ProdPerfect QA , element_node_name : SPAN , element_tag_name : SPAN , element_cursor : pointer
//         .click(Selector('a').withAttribute('href',/.*\/logout.*/i).filterVisible().nth(0))  //text :  Logout , element_text_content :  Logout , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(1) > li > ul > li:eq(4) > a , element_tag_name : A , element_cursor : pointer
//         .expect(getLocation()).match(/buildout\.com\//);

// })
//
// test('2018_12_16_buildout_test_bonus',async t => {
//     // description: generate a comp
//   // video:  https://drive.google.com/open?id=11WVI-xKMfpYtSGmBAG7dyTronw0YcCug
//
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //text : log in , element_text_content : log in , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/login/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','login'))
//         .typeText(Selector('input').withAttribute('id','login'),'buildout-user@prodperfect.com',{replace:true})  //name : login , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#login , element_type : text , element_tag_name : INPUT , class : login_field email w-input , element_value : buildout-user@prodperfect.com , element_cursor : text
//         .click(Selector('input').withAttribute('id','password'))
//         .typeText(Selector('input').withAttribute('id','password'),'Bu1ld0uT+Pr0dP3rf3cT',{replace:true})  //name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_type : password , element_tag_name : INPUT , class : login_field w-input , element_value : Bu1ld0uT+Pr0dP3rf3cT , element_cursor : text
//         .click(Selector('#login_form > input').nth(2))  //element_node_name : INPUT , element_type : submit , element_tag_name : INPUT , class : login_button w-button , element_value : Log In > , value : Log In > , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/properties/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/comps\/sale\_comps.*/i).filterVisible().nth(0))  //text : COMPS , element_text_content : COMPS , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(0) > li:eq(3) > a , element_tag_name : A , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/comps\/sale\_comps/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/comps\/sale\_comps\/new.*/i).filterVisible().nth(0))  //text : New Sale Comp , element_text_content : New Sale Comp , element_node_name : A , element_selector : body > form#sale_comp_search > div:eq(1) > div > div:eq(1) > a , element_tag_name : A , class : btn btn-create js-new-comp-button full-width , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/comps\/sale\_comps\/new/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','comp_on_market_false'))  //name : comp[on_market] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#generalFields > div > div > div > div > span:eq(0) > label > input#comp_on_market_false , element_type : radio , element_tag_name : INPUT , class : radio_buttons optional , element_value : false , value : false , element_cursor : default
//         .click(Selector('body > input'))  //element_node_name : INPUT , element_type : file , element_tag_name : INPUT , class : dz-hidden-input , element_cursor : default
//         .click(Selector('#mediaFields > div').nth(1).find('div').nth(1).find('h4 > span'))  //element_text_content : Drag files, or click here to add files , element_node_name : SPAN , element_tag_name : SPAN , class : text-muted , element_cursor : pointer
//         .click(Selector('input').withAttribute('id','comp[research_property_attributes]_photo_attachments_attributes_1545087786171_description'))
//         .typeText(Selector('input').withAttribute('id','comp[research_property_attributes]_photo_attachments_attributes_1545087786171_description'),'this is a photo (really it is a pdf)',{replace:true})  //name : comp[research_property_attributes][photo_attachments_attributes][1545087786171][description] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#mediaFields > div:eq(0) > div > div > div:eq(2) > div:eq(1) > div > div:eq(0) > div > div:eq(0) > div > input#comp[research_property_attributes]_photo_attachments_attributes_1545087786171_description , element_type : text , element_tag_name : INPUT , class : form-control string optional , element_value : this is a photo (really it is a pdf) , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_address'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_address'),'5539 Westlawn Ave',{replace:true})  //name : comp[research_property_attributes][address] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#locationFields > div:eq(0) > div > input#comp_research_property_attributes_address , element_type : text , element_tag_name : INPUT , class : form-control string required , element_value : 5539 Westlawn Ave , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_city'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_city'),'Los Angeles',{replace:true})  //name : comp[research_property_attributes][city] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#locationFields > div:eq(1) > div > input#comp_research_property_attributes_city , element_type : text , element_tag_name : INPUT , class : form-control string optional , element_value : Los Angeles , element_cursor : text
//         .click(Selector('select').withAttribute('id','comp_research_property_attributes_state').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','comp_research_property_attributes_state').filterVisible().nth(0).find('option').withAttribute('value','CA').filterVisible())  //name : comp[research_property_attributes][state] , element_text_content :  AK - Alaska AL - Alabama AR - Arkansas AZ - Arizona CA - California CO - Colorado CT - Connecticut DC - District of Columbia DE - Delaware FL - Florida GA - Georgia HI - Hawaii IA - Iowa ID - Idaho IL - Illinois IN - Indiana KS - Kansas KY - Kentucky LA - Louisiana MA - Massachusetts MD - Maryland ME - Maine MI - Michigan MN - Minnesota MO - Missouri MS - Mississippi MT - Montana NC - North Carolina ND - North Dakota NE - Nebraska NH - New Hampshire NJ - New Jersey NM - New Mexico NV - Nevada NY - New York OH - Ohio OK - Oklahoma OR - Oregon PA - Pennsylvania PR - Puerto Rico RI - Rhode Island SC - South Carolina SD - South Dakota TN - Tennessee TX - Texas UT - Utah VA - Virginia VT - Vermont WA - Washington WI - Wisconsin WV - West Virginia WY - Wyoming , element_node_name : SELECT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#locationFields > div:eq(2) > div > select#comp_research_property_attributes_state , element_type : select-one , element_tag_name : SELECT , class : form-control select optional , element_value : CA , element_cursor : pointer , element_options : value: CA, text:CA - California , value :  CA , option_text : CA - California
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_zip'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_zip'),'90066',{replace:true})  //name : comp[research_property_attributes][zip] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#locationFields > div:eq(3) > div > input#comp_research_property_attributes_zip , element_type : text , element_tag_name : INPUT , class : form-control string optional , element_value : 90066 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_name'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_name'),'The FunkfordShire Palms',{replace:true})  //name : comp[research_property_attributes][name] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(0) > div > input#comp_research_property_attributes_name , element_type : text , element_tag_name : INPUT , class : form-control string optional , element_value : The FunkfordShire Palms , element_cursor : text
//         .click(Selector('textarea').withAttribute('id','comp_description').filterVisible().nth(0))  //name : comp[description] , element_node_name : TEXTAREA , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(1) > div > textarea#comp_description , element_type : textarea , element_tag_name : TEXTAREA , class : form-control text optional text-lg , element_cursor : text
//         .click(Selector('textarea').withAttribute('id','comp_description').filterVisible().nth(0))
//         .typeText(Selector('textarea').withAttribute('id','comp_description').filterVisible().nth(0),'ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',{replace:true})  //name : comp[description] , element_node_name : TEXTAREA , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(1) > div > textarea#comp_description , element_type : textarea , element_tag_name : TEXTAREA , class : form-control text optional text-lg , element_value : ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh , element_cursor : text
//         .click(Selector('select').withAttribute('id','comp_property_type_or_subtype_id').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','comp_property_type_or_subtype_id').filterVisible().nth(0).find('option').withAttribute('value','2').filterVisible())  //name : comp[property_type_or_subtype_id] , element_text_content :  Office Retail Industrial Land Multifamily Special Purpose Hospitality Medical Office Mobile Home Park , element_node_name : SELECT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(2) > div > select#comp_property_type_or_subtype_id , element_type : select-one , element_tag_name : SELECT , class : form-control select required , element_value : 2 , element_cursor : pointer , element_options : value: 2, text:Retail , value :  2 , option_text : Retail
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_building_size'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_building_size'),'5000',{replace:true})  //name : comp[research_property_attributes][building_size] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(3) > div > input#comp_research_property_attributes_building_size , element_type : number , element_tag_name : INPUT , class : form-control numeric float optional , element_value : 5000 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_lot_size'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_lot_size'),'5',{replace:true})  //name : comp[research_property_attributes][lot_size] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(4) > div:eq(0) > div > div > input#comp_research_property_attributes_lot_size , element_type : number , element_tag_name : INPUT , class : form-control numeric float optional , element_value : 5 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_year_built'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_year_built'),'1900',{replace:true})  //name : comp[research_property_attributes][year_built] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(5) > div > input#comp_research_property_attributes_year_built , element_type : number , element_tag_name : INPUT , class : form-control numeric integer optional , element_value : 1900 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_number_of_units'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_number_of_units'),'40',{replace:true})  //name : comp[research_property_attributes][number_of_units] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(7) > div > input#comp_research_property_attributes_number_of_units , element_type : number , element_tag_name : INPUT , class : form-control numeric integer optional , element_value : 40 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_research_property_attributes_occupancy_pct'))
//         .typeText(Selector('input').withAttribute('id','comp_research_property_attributes_occupancy_pct'),'50',{replace:true})  //name : comp[research_property_attributes][occupancy_pct] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#propertyFields > div:eq(8) > div > input#comp_research_property_attributes_occupancy_pct , element_type : number , element_tag_name : INPUT , class : form-control numeric float optional , element_value : 50 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_sale_date'))  //name : comp[sale_date] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#financialFields > div:eq(0) > div > input#comp_sale_date , element_type : text , element_tag_name : INPUT , class : form-control string optional datepicker hasDatepicker , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_price'))
//         .typeText(Selector('input').withAttribute('id','comp_price'),'9999999',{replace:true})  //name : comp[price] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#financialFields > div:eq(2) > div > input#comp_price , element_type : number , element_tag_name : INPUT , class : form-control numeric integer required , element_value : 9999999 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_cap_rate_pct'))
//         .typeText(Selector('input').withAttribute('id','comp_cap_rate_pct'),'30',{replace:true})  //name : comp[cap_rate_pct] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#financialFields > div:eq(5) > div > input#comp_cap_rate_pct , element_type : number , element_tag_name : INPUT , class : form-control numeric float optional , element_value : 30 , element_cursor : text
//         .click(Selector('input').withAttribute('id','comp_net_operating_income'))
//         .typeText(Selector('input').withAttribute('id','comp_net_operating_income'),'1112223',{replace:true})  //name : comp[net_operating_income] , element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > div#financialFields > div:eq(6) > div > input#comp_net_operating_income , element_type : number , element_tag_name : INPUT , class : form-control numeric integer optional , element_value : 1112223 , element_cursor : text
//         .click(Selector('input').withAttribute('name','commit'))  //element_node_name : INPUT , element_selector : body > form#new_comp > div:eq(1) > div > div > div > div:eq(1) > input , element_type : submit , element_tag_name : INPUT , class : btn btn-save top-buffer-md right-buffer-md , element_value : Create Comp , value : Create Comp , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/comps\/sale\_comps/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('#js-result-container > table > tbody > tr').nth(0).find('td').nth(1).find('a > h3'))  //element_text_content : The FunkfordShire Palms , element_node_name : H3 , element_tag_name : H3 , class : no-top-margin text-default , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/comps\/sale\_comps\/196607\/edit/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('#navbar > ul').nth(1).find('li > a > div > div > span').nth(0))  //element_text_content : ProdPerfect QA , element_node_name : SPAN , element_tag_name : SPAN , element_cursor : pointer
//         .click(Selector('a').withAttribute('href',/.*\/logout.*/i).filterVisible().nth(0))  //text :  Logout , element_text_content :  Logout , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(1) > li > ul > li:eq(4) > a , element_tag_name : A , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\//);
//
// })
//
// test('2018_12_16_buildout_test_report',async t => {
//     // description: generate a report
//   // https://drive.google.com/open?id=1w3sEOOSwnKInaJopxSTrrT498kUMjkk5
//
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/login.*/i).filterVisible().nth(0))  //text : log in , element_text_content : log in , element_node_name : A , element_selector : body > div:eq(0) > div > div:eq(1) > div:eq(0) > nav > a:eq(6) , element_tag_name : A , class : navbar__link is--home js-log-in w-nav-link , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/login/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','login'))
//         .typeText(Selector('input').withAttribute('id','login'),'buildout-user@prodperfect.com',{replace:true})  //name : login , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#login , element_type : text , element_tag_name : INPUT , class : login_field email w-input , element_value : buildout-user@prodperfect.com , element_cursor : text
//         .click(Selector('input').withAttribute('id','password'))
//         .typeText(Selector('input').withAttribute('id','password'),'Bu1ld0uT+Pr0dP3rf3cT',{replace:true})  //name : password , element_node_name : INPUT , element_selector : body > div > div > div > div:eq(2) > form#login_form > input#password , element_type : password , element_tag_name : INPUT , class : login_field w-input , element_value : Bu1ld0uT+Pr0dP3rf3cT , element_cursor : text
//         .click(Selector('#login_form > input').nth(2))  //element_node_name : INPUT , element_type : submit , element_tag_name : INPUT , class : login_button w-button , element_value : Log In > , value : Log In > , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/properties/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('a').withAttribute('href',/.*\/reports.*/i).filterVisible().nth(0))  //text : REPORTS , element_text_content : REPORTS , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(0) > li:eq(2) > a , element_tag_name : A , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\/reports/);
//
//     await setProdPerfectTracking(t);
//     await t
//         .click(Selector('input').withAttribute('id','inventory_report_title'))
//         .typeText(Selector('input').withAttribute('id','inventory_report_title'),'This is a report this is a report report report',{replace:true})  //name : inventory_report[title] , element_node_name : INPUT , element_selector : body > form > div > div:eq(0) > div > div:eq(0) > input#inventory_report_title , element_type : text , element_tag_name : INPUT , class : form-control , element_value : This is a report this is a report report report , element_cursor : text
//         .click(Selector('select').withAttribute('id','brokers').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','brokers').filterVisible().nth(0).find('option').withAttribute('value','24013').filterVisible())  //name : brokers , element_node_name : SELECT , element_selector : body > form > div > div:eq(0) > div > div:eq(1) > div > div:eq(0) > div > div:eq(0) > div > div:eq(0) > select#brokers , element_type : select-one , element_tag_name : SELECT , class : form-control , element_value : 24013 , element_cursor : default , element_options : value: 24013, text:ProdPerfect QA , value :  24013 , option_text : ProdPerfect QA
//         .click(Selector('select').withAttribute('id','types').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','types').filterVisible().nth(0).find('option').withAttribute('value','1').filterVisible())  //name : types , element_node_name : SELECT , element_selector : body > form > div > div:eq(0) > div > div:eq(1) > div > div:eq(0) > div > div:eq(0) > div > div:eq(1) > select#types , element_type : select-one , element_tag_name : SELECT , class : form-control , element_value : 1 , element_cursor : default , element_options : value: 1, text:Office , value :  1 , option_text : Office
//         .click(Selector('body > form > div > div').nth(0).find('div > div').nth(1).find('div > div').nth(1).find('div > div').nth(1).find('ul > li > div > div').nth(2).find('span').nth(0).find('svg > path'))  //element_node_name : path , element_tag_name : path , element_cursor : pointer
//         .click(Selector('body > form > div > div').nth(0).find('div > div').nth(1).find('div > div').nth(1).find('div > div').nth(1).find('ul > li').nth(1).find('div > div').nth(2).find('span').nth(0).find('svg'))  //element_node_name : svg , element_tag_name : svg , element_cursor : pointer
//         .click(Selector('body > form > div > div').nth(0).find('div > div').nth(1).find('div > div').nth(1).find('div > div').nth(1).find('ul > li').nth(2).find('div > div').nth(2).find('span').nth(0).find('svg > path'))  //element_node_name : path , element_tag_name : path , element_cursor : pointer
//         .click(Selector('body > form > div > div').nth(0).find('div > div').nth(1).find('div > div').nth(0).find('div > div').nth(1).find('ul > li:eq(16) > div > div').nth(2).find('span').nth(1).find('svg'))  //element_node_name : svg , element_tag_name : svg , element_cursor : pointer
//         .click(Selector('a').withAttribute('href',/.*\/reports\#.*/i).filterVisible().nth(0))  //text : Add All , element_text_content : Add All , element_node_name : A , element_selector : body > form > div > div:eq(0) > div > div:eq(1) > div > div:eq(0) > div > div:eq(0) > div > div:eq(3) > a , element_tag_name : A , class : pull-right js-add-all , element_cursor : pointer
//         .click(Selector('select').withAttribute('id','inventory_report_page_size').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','inventory_report_page_size').filterVisible().nth(0).find('option').withAttribute('value','US-Tabloid').filterVisible())  //name : inventory_report[page_size] , element_node_name : SELECT , element_selector : body > form > div > div:eq(1) > div:eq(0) > div > select#inventory_report_page_size , element_type : select-one , element_tag_name : SELECT , class : form-control , element_value : US-Tabloid , element_cursor : default , element_options : value: US-Tabloid, text:Tabloid - 11 x 17" , value :  US-Tabloid , option_text : Tabloid - 11 x 17"
//         .click(Selector('select').withAttribute('id','inventory_report_columns').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','inventory_report_columns').filterVisible().nth(0).find('option').withAttribute('value','4').filterVisible())  //name : inventory_report[columns] , element_node_name : SELECT , element_selector : body > form > div > div:eq(1) > div:eq(1) > div > select#inventory_report_columns , element_type : select-one , element_tag_name : SELECT , class : form-control , element_value : 4 , element_cursor : default , element_options : value: 4, text:4 , value :  4 , option_text : 4
//         .click(Selector('select').withAttribute('id','inventory_report_group_by').filterVisible().nth(0))
//         .click(Selector('select').withAttribute('id','inventory_report_group_by').filterVisible().nth(0).find('option').withAttribute('value','county').filterVisible())  //name : inventory_report[group_by] , element_node_name : SELECT , element_selector : body > form > div > div:eq(1) > div:eq(2) > div > select#inventory_report_group_by , element_type : select-one , element_tag_name : SELECT , class : form-control , element_value : county , element_cursor : default , element_options : value: county, text:County , value :  county , option_text : County
//         .click(Selector('input').withAttribute('name','commit'))  //element_node_name : INPUT , element_selector : body > form > div > input , element_type : submit , element_tag_name : INPUT , class : btn btn-save top-buffer-sm , element_value : Generate and Download Report , value : Generate and Download Report , element_cursor : pointer
//         .click(Selector('#navbar > ul').nth(1).find('li > a > div > div > span').nth(0))  //element_text_content : ProdPerfect QA , element_node_name : SPAN , element_tag_name : SPAN , element_cursor : pointer
//         .click(Selector('a').withAttribute('href',/.*\/logout.*/i).filterVisible().nth(0))  //text :  Logout , element_text_content :  Logout , element_node_name : A , element_selector : body > nav > div > div#navbar > ul:eq(1) > li > ul > li:eq(4) > a , element_tag_name : A , element_cursor : pointer
//         .expect(getLocation()).match(/http\:\/\/staging\.buildout\.com\//);
//
// })
