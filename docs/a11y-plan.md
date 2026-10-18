# Accessibility plan

## Structure
- Landmarks: header, nav, main, five sections, and a footer.
- One h1 for the page, an h2 for each section, and h3 for the chart and the Backup box. 
- A skip-to-content link is the first thing you reach with Tab.

## Forms
- Every input has a label connected with for and id.
- Error messages sit next to their field, are linked with aria-describedby and announce through aria-live.
- Forms use novalidate, so my own regex messages show instead of the browser's pop-ups.

## Live messages
- The spending cap has two live regions: a polite one when I am under the cap and an assertive one when I am over.
- The Backup Status (export and import) is a polite live region. 

## Keyboard
- Everthing works with Tab, Shift+Tab, Enter, and Space.
- Sort controls are real buttons
- Edit and Delete buttons have an aria-label that names the record, for ex., "Delete Cab Fare".
- Clicking Edit moves the cursor into the form.
- Focus outlines are visible on links, buttons, and inputs.

## Tables and charts
- The table has a caption, and header cells use scope="col".
- Search highlights use the mark element .
- The bar chart is a list, so a screen reader reads each day. The bars are hidden from assistive tech (aria-hidden) because the amount and date are written out as text, and a summary line sits under the charts.

## Colour and motion
- Error and warning text uses a darker red to meet contrast.
- Meaning never depends on colour alone; messages say "Over your cap" and results say PASS or FAIL.
- The chart animation switches pff for people who ask for reduced motion (prefers-reduced-motion).

## Layout
- Mobile first, with wider ;ayouts at 768px and 1024px.
- Wide content (the table and the chart) scrolls inside its own box, so the page never scrolls sideways.

## How I checked 
- Tabbed through the whole page without a mouse.
- Resized to about 360px wide and zoomed to 200%.
- Ran the tests in test.html.