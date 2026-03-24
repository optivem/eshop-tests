using SystemTests.Legacy.Mod10.AcceptanceTests.Base;
using Dsl.Core.Shop;
using Driver.Port.Shop.Dtos;
using Optivem.Testing;
using Xunit;

namespace SystemTests.Legacy.Mod10.AcceptanceTests;

[Collection("Isolated")]
public class CancelOrderPositiveIsolatedTest : BaseAcceptanceTest
{
    [Theory]
    [Time]
    [ChannelData(ChannelType.UI, ChannelType.API)]
    [ChannelInlineData("2024-12-31T21:59:59Z")]   // 1 second before blackout period starts
    [ChannelInlineData("2024-12-31T22:30:01Z")]   // 1 second after blackout period ends
    [ChannelInlineData("2024-12-31T10:00:00Z")]   // Another time on blackout day but outside blackout period
    [ChannelInlineData("2025-01-01T22:15:00Z")]   // Another day entirely (same time but different day)
    public async Task ShouldBeAbleToCancelOrderOutsideOfBlackoutPeriod31stDecBetween2200And2230(Channel channel, string timeIso)
    {
        await Scenario(channel)
            .Given().Clock().WithTime(timeIso)
            .And().Order().WithStatus(OrderStatus.Placed)
            .When().CancelOrder()
            .Then().ShouldSucceed();
    }
}













