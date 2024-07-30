
import "./home.css"; 

function HelpCenter(){
    return (
        <>
        <main class="helpCenter overflow">
            <div class="helpheading" >
                <h1>Carpool Help Centre</h1>
            </div>
            <div class="helpGrid">
            <div class="helpSection">
                <h4>How do I book a carpool ride?</h4>
                <p>You can book a carpool ride on our mobile app, or on blablacar.com. Simply search for your destination, choose the date you want to travel and pick the carpool that suits you best! Some rides can be booked instantly, while other rides require manual approval from the driver.</p>
            </div>
            <div class="helpSection">
                <h4>
                    How do I cancel my carpool ride?
                </h4>
                <p>If you have a change of plans, you can always cancel your carpool ride from the ‘Your rides’ section of our app. The sooner you cancel, the better. That way the driver has time to accept new passengers. The amount of your refund will depend on how far in advance you</p>
            </div>
            <div class="helpSection"><h4>How much does a carpool ride cost?</h4>
            <p>The costs of a carpool ride can vary greatly, and depend on factors like distance, time of departure, the demand of that ride and more. It is also up to the driver to decide how much to charge per seat, so it’s hard to put an exact price tag on a ride. </p></div>
            <div class="helpSection">
                <h4>How do I publish a carpool ride?</h4>
                <p>Offering a carpool ride on BlaBlaCar is easy. To publish your ride, use our mobile app or blablacar.com. Indicate your departure and arrival points, the date and time of your departure, how many</p>
            </div>
            <div class="helpSection">
                <h4>What are the benefits of travelling by carpool?</h4>
                <p>There are multiple advantages to carpooling, over other means of transport. Travelling by carpool is usually more affordable, especially for longer distances. Carpooling is also more eco-friendly, as sharing a car means there will be fewer cars on the road, and therefore fewer emissions. Taking a carpool ride is also a safe way to travel in the</p>
            </div>
            <div class="helpSection">
                <h4>How do I start carpooling?</h4>
                <p>Carpooling with BlaBlaCar is super easy, and free! Simply sign up for an account and tell us some basic details about yourself. Once you have a BlaBlaCar account, you can start booking or publishing rides directly on our app or website.</p>
            </div>
          </div>
          <div class="hlepbtn">
          <button id="helpbtn">Read Our Help Center</button>
        </div>
        </main>
        </>
    )
}

export default HelpCenter;