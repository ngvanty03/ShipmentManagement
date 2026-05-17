using MediatR;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShipmentManagement.Application.Queries.User.GetUsersById
{
    public class GetUsersByIdQuery : IRequest<UserDTO>
    {
        public string Id { get; set; }
    }
}
